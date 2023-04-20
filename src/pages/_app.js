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

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser } from "@supabase/auth-helpers-react";
import Main from "@/components/Layout/Main";
import PageWrapper from "@/components/Layout/PageWrapper";
import PageTitle from "@/components/Layout/PageTitle";

const PleaseLoginWrapper = ({ children }) => {
    const supabase = useSupabaseClient();
    return !useUser() ? (
        <PageWrapper>
            {/* card */}
            <div className="shadow-md mx-auto p-12 max-w-xl rounded-lg ring-1 ring-black ring-opacity-10">
                <PageTitle title="Sign in" breadCrumbs={[]} />
                <Auth
                    redirectTo="http://localhost:3000/"
                    appearance={{
                        theme: {
                            ...ThemeSupa,
                            // change the color from green to orange of the supabase login button
                            default: {
                                ...ThemeSupa.default,
                                colors: { brand: "#F6A037", brandAccent: "#FCA563" },
                            },
                        },
                    }}
                    supabaseClient={supabase}
                    providers={[]}
                    socialLayout="horizontal"
                />
            </div>
        </PageWrapper>
    ) : (
        children
    );
};

const App = ({ Component, pageProps }) => {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());
    return (
        <SWRConfig value={swrOptions}>
            <SessionContextProvider
                supabaseClient={supabaseClient}
                initialSession={pageProps.initialSession}
            >
                <Layout>
                    <PleaseLoginWrapper>
                        <Component {...pageProps} />
                    </PleaseLoginWrapper>
                </Layout>
            </SessionContextProvider>
        </SWRConfig>
    );
};
export default App;
