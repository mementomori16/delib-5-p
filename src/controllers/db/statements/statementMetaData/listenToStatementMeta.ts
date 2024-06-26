import { Collections, StatementMetaData, StatementMetaDataSchema } from "delib-npm";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { DB } from "../../config";
import { Dispatch } from "@reduxjs/toolkit";
import { setStatementMetaData } from "../../../../model/statements/statementsMetaSlice";
import { writeZodError } from "../../../general/helpers";

export function listenToStatementMetaData(statementId: string, dispatch: Dispatch): Unsubscribe {
	try {
		if (!statementId) {
			throw new Error("Statement ID is missing");
		}

		const statementMetaDataRef = doc(DB, Collections.statementsMetaData, statementId);
		
		return onSnapshot(statementMetaDataRef, (statementMetaDataDB) => {
			try {
				if (!statementMetaDataDB.exists()) {
					throw new Error("Statement meta does not exist");

				}
				const statementMetaData = statementMetaDataDB.data() as StatementMetaData;

				const results = StatementMetaDataSchema.safeParse(statementMetaData);
				if (!results.success) {
					writeZodError(results.error, statementMetaData);
					throw new Error("StatementMetaDataSchema failed to parse");
				}


				dispatch(setStatementMetaData(statementMetaData));
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {
		console.error(error);

		//@ts-ignore
		return () => {console.error("Unsubscribe function not returned")};
	}
}