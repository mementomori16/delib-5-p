import { FC } from "react";

// Third party imports
import { Statement } from "delib-npm";

// Redux store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";
import {
    parentVoteSelector,
    setVoteToStore,
} from "../../../../../model/vote/votesSlice";

// Statements helpers
import { setVote } from "../../../../../functions/db/vote/setVote";
import { getSelections } from "./getSelections";
import useWindowDimensions from "../../../../../functions/hooks/useWindowDimentions";
import { statementTitleToDisplay } from "../../../../../functions/general/helpers";

export interface OptionBarProps {
    option: Statement;
    totalVotes: number;
    statement: Statement;
    order: number;
}
export const OptionBar: FC<OptionBarProps> = ({
    option,
    totalVotes,
    statement,
    order,
}) => {
    const dispatch = useAppDispatch();
    const vote = useAppSelector(parentVoteSelector(option.parentId));
    const direction = document.body.style.direction as "ltr" | "rtl";

    const _optionOrder = option.order || 0;

    const handlePressButton = () => {
        dispatch(setVoteToStore(option));
        setVote(option);
    };

    const selections: number = getSelections(statement, option);
    const { width } = useWindowDimensions();

    const barWidth = width / 4 > 120 ? 120 : width / 4;
    const padding = 10;

    const { shortVersion } = statementTitleToDisplay(
        option.statement,
        30
    );

    return (
        <div
            className="statement__vote__bar"
            style={{
                right: `${(_optionOrder - order) * barWidth}px`,
                width: `${barWidth}px`,
            }}
        >
            <div
                className="statement__vote__bar__column"
                style={{ width: `${barWidth}px` }}
            >
                <div
                    className="statement__vote__bar__column__bar"
                    style={{
                        height: `${(selections / totalVotes) * 100}%`,
                        width: `${barWidth - padding}px`,
                    }}
                >
                    {selections}
                </div>
            </div>
            <div
                style={{
                    width: `${barWidth - padding}px`,
                    direction: direction,
                }}
                className={
                    vote?.statementId === option.statementId
                        ? "statement__vote__bar__btn statement__vote__bar__btn--selected"
                        : "statement__vote__bar__btn"
                }
                onClick={handlePressButton}
            >
                {shortVersion}
            </div>
        </div>
    );
};