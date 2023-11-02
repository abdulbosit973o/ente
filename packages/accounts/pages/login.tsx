import { useState, useEffect } from 'react';
import EnteSpinner from '@ente/shared/components/EnteSpinner';
import Login from '../components/Login';
import { VerticallyCentered } from '@ente/shared/components/Container';
import { getData, LS_KEYS } from '@ente/shared/storage/localStorage';
import { PAGES } from '../constants/pages';
import FormPaper from '@ente/shared/components/Form/FormPaper';
import { NextRouter } from 'next/router';

interface HomeProps {
    appContext: {
        showNavBar: (show: boolean) => void;
    };
    router: NextRouter;
    appName: string;
}

export default function Home({ appContext, router, appName }: HomeProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        router.prefetch(PAGES.VERIFY);
        router.prefetch(PAGES.SIGNUP);
        const user = getData(LS_KEYS.USER);
        if (user?.email) {
            router.push(PAGES.VERIFY);
        }
        setLoading(false);
        appContext?.showNavBar?.(true);
    }, []);

    const register = () => {
        router.push(PAGES.SIGNUP);
    };

    return loading ? (
        <VerticallyCentered>
            <EnteSpinner />
        </VerticallyCentered>
    ) : (
        <VerticallyCentered>
            <FormPaper>
                <Login signUp={register} appName={appName} />
            </FormPaper>
        </VerticallyCentered>
    );
}
