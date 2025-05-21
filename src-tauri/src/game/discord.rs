use discord_rpc_client::Client;
use dotenvy::dotenv;
use once_cell::sync::Lazy;
use std::{
    collections::HashMap,
    env,
    panic,
    sync::Mutex,
    thread,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

static DISCORD_CLIENT: Lazy<Mutex<Option<Client>>> = Lazy::new(|| Mutex::new(None));
static START_TIME: Lazy<u64> = Lazy::new(|| {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
});

static CURRENT_VERSION: Lazy<Mutex<Option<String>>> = Lazy::new(|| Mutex::new(None));

// Expansion → Zone description
static EXPANSION_ZONES: Lazy<HashMap<&'static str, &'static str>> = Lazy::new(|| {
    HashMap::from([
        ("VA", "Exploring Azeroth"),
        ("TBC", "Exploring Outland"),
        ("LK", "Exploring Northrend"),
        ("CATA", "Exploring the Cataclysm"),
        ("MOP", "Exploring Pandaria"),
        ("WOD", "Exploring Draenor"),
        ("LG", "Exploring the Broken Isles"),
        ("BFA", "Exploring Kul Tiras & Zandalar"),
        ("SL", "Exploring the Shadowlands"),
        ("DF", "Exploring the Dragon Isles"),
        ("TWW", "Exploring Khaz Algar"),
    ])
});

static STATE_DETAILS: Lazy<HashMap<&'static str, &'static str>> = Lazy::new(|| {
    HashMap::from([
        ("VA", "Playing Classic"),
        ("TBC", "Playing The Burning Crusade"),
        ("LK", "Playing Wrath of the Lich King"),
        ("CATA", "Playing Cataclysm"),
        ("MOP", "Playing Mists of Pandaria"),
        ("WOD", "Playing Warlords of Draenor"),
        ("LG", "Playing Legion"),
        ("BFA", "Playing Battle for Azeroth"),
        ("SL", "Playing Shadowlands"),
        ("DF", "Playing Dragonflight"),
        ("TWW", "Playing The War Within"),
    ])
});

pub fn setup_discord_rpc() {
    dotenv().ok();

    let app_id: u64 = env::var("DISCORD_CLIENT_ID")
        .expect("DISCORD_CLIENT_ID not set")
        .parse()
        .expect("DISCORD_CLIENT_ID must be a valid u64");

    thread::spawn(move || {
        let result = panic::catch_unwind(|| {
            fn start_client(app_id: u64) -> Client {
                let mut client = Client::new(app_id);
                client.start();
                client
            }

            {
                let mut global = DISCORD_CLIENT.lock().unwrap();
                *global = Some(start_client(app_id));
            }

            loop {
                let mut need_reconnect = false;

                {
                    let mut global = DISCORD_CLIENT.lock().unwrap();

                    if let Some(client) = global.as_mut() {
                        let version_opt = CURRENT_VERSION.lock().unwrap().clone();
                        let (image_key, details, state) = if let Some(version) = version_opt {
                            let image_key = version.to_lowercase();
                            let details = EXPANSION_ZONES
                                .get(version.as_str())
                                .copied()
                                .unwrap_or("Exploring Azeroth")
                                .to_string();
                            let state = STATE_DETAILS
                                .get(version.as_str())
                                .copied()
                                .unwrap_or("Playing World of Warcraft")
                                .to_string();
                            (image_key, details, state)
                        } else {
                            ("default".into(), "Exploring Azeroth".into(), "Idle".into())
                        };

                        let res = client.set_activity(|act| {
                            act.state(&state)
                                .details(&details)
                                .timestamps(|t| t.start(*START_TIME))
                                .assets(|assets| assets.large_image(&image_key))
                        });

                        if res.is_err() {
                            eprintln!("Failed to update Discord presence, will try reconnect");
                            need_reconnect = true;
                        }
                    } else {
                        need_reconnect = true;
                    }
                }

                if need_reconnect {
                    eprintln!("Reconnecting Discord RPC client...");
                    let mut global = DISCORD_CLIENT.lock().unwrap();
                    *global = Some(start_client(app_id));
                }

                thread::sleep(Duration::from_secs(15));
            }
        });

        if let Err(err) = result {
            eprintln!("Discord thread panicked: {:?}", err);
        }
    });
}

#[tauri::command]
pub fn update_presence(version: String) -> Result<(), String> {
    {
        let mut stored = CURRENT_VERSION.lock().map_err(|e| e.to_string())?;
        *stored = Some(version.clone());
    }

    // Spawn a thread so this doesn't block if Discord isn't running
    std::thread::spawn(move || {
        let mut global = match DISCORD_CLIENT.lock() {
            Ok(g) => g,
            Err(_) => {
                eprintln!("Failed to acquire DISCORD_CLIENT lock");
                return;
            }
        };

        let Some(client) = global.as_mut() else {
            eprintln!("Discord client not initialized");
            return;
        };

        let image_key = version.to_lowercase();
        let details = EXPANSION_ZONES
            .get(version.as_str())
            .copied()
            .unwrap_or("Exploring Azeroth");
        let state = STATE_DETAILS
            .get(version.as_str())
            .copied()
            .unwrap_or("Exploring Azeroth");

        if let Err(e) = client.set_activity(|act| {
            act.state(state)
                .details(details)
                .timestamps(|t| t.start(*START_TIME))
                .assets(|assets| assets.large_image(&image_key))
        }) {
            eprintln!("Failed to set activity: {:?}", e);
        }
    });

    Ok(())
}
