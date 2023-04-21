import { useState } from "react";
import { SWRConfig } from "swr";

// Supabase db and auth
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

// Components
import Layout from "@/components/Layout/Layout";
import PageWrapper from "@/components/Layout/PageWrapper";
import PageTitle from "@/components/Layout/PageTitle";

// Global style
import "@/styles/globals.css";

// Set up swr options, and realtime polling (even simpler than supabase-realtime websockets)
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
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());
    return (
        <SWRConfig value={swrOptions}>
            <SessionContextProvider supabaseClient={supabaseClient}>
                <Layout>
                    <PleaseLoginWrapper>
                        <Component {...pageProps} />
                    </PleaseLoginWrapper>
                </Layout>
            </SessionContextProvider>
        </SWRConfig>
    );
};

const PleaseLoginWrapper = ({ children }) => {
    const supabase = useSupabaseClient();

    // Make it orange!
    const appearance = { theme: ThemeSupa };
    appearance.theme.default.colors = { brand: "#F6A037", brandAccent: "#FCA563" };

    return !!useUser() ? (
        children
    ) : (
        <PageWrapper>
            <div className="card">
                <PageTitle title="Sign in" breadCrumbs={[]} />
                <Auth appearance={appearance} supabaseClient={supabase} providers={[]} />
            </div>
        </PageWrapper>
    );
};

export default App;
