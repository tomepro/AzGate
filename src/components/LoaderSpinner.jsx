import { Bars } from 'react-loader-spinner'
export default () => (
<Bars
height="80"
width="100%"
color="white"
ariaLabel="bars-loading"
wrapperStyle={{"position":"absolute","left":"50%","top":"50%","text-align":"center","transform":"translate(-50%, -50%)"}}
wrapperClass=""
visible={true}
/>
);