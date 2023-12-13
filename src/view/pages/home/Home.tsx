import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useParams } from "react-router-dom";
import { StatementSubscription } from "delib-npm";


// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
} from "../../../model/statements/statementsSlice";

// Helpers
import { listenStatmentsSubsciptions } from "../../../functions/db/statements/getStatement";
import ScreenSlide from "../../components/animation/ScreenSlide";
import HomeHeader from "./HomeHeader";

import { userSelector } from "../../../model/users/userSlice";




export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const { statementId } = useParams();
    const location = useLocation();
    const user = useAppSelector(userSelector);

    const [displayHeader, setDisplayHeader] = useState(true);
   

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

    //callbacks
    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription));
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }



    //use effects

    useEffect(() => {
        let unsubscribe: Function = () => {};
        try {
            if (user) {
                unsubscribe = listenStatmentsSubsciptions(
                    updateStoreStSubCB,
                    deleteStoreStSubCB,
                    10,
                    true
                );

            

               
            }
        } catch (error) {}
        return () => {
            unsubscribe();
        };
    }, [user]);
    return (
        <ScreenSlide className="page" slideFromRight={true}>
            {displayHeader && <HomeHeader />}
            <Outlet />
        
        </ScreenSlide>
    );
}
