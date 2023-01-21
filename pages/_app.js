import '/styles/globals.css'
import {AppWrapper} from "../store/store-context";

const App = ({Component, pageProps}) => {
    return (<AppWrapper>
        <Component {...pageProps} />
    </AppWrapper>);
}

export default App;
