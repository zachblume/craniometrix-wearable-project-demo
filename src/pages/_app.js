import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { SWRConfig } from "swr";

let swrOptions = {
    fetcher: (url, init) => fetch(url, init).then((res) => res.json()),
    keepPreviousData: true,
};

const realtime = false; // Set to true for 250ms polling
if (realtime) {
    swrOptions = {
        ...swrOptions,
        refreshInterval: 250,
        dedupingInterval: 250,
        focusThrottleInterval: 250,
    };
}

const App = ({ Component, pageProps }) => {
    return (
        <SWRConfig value={swrOptions}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SWRConfig>
    );
};
export default App;
