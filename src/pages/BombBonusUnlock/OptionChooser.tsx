import { Wrapper } from "../../components/swap/styleds";
import { ButtonPrimary } from "../../components/ButtonLegacy";
import React from "react";
import moment from "moment/moment";
import { useTransactionAdder } from "../../state/transactions/hooks";
import { formatBalance } from "../../utils";


export default function OptionChooser({ userInfo, bombLockingClaimContract }: { userInfo: any, bombLockingClaimContract: any }) {
    const now = moment();
    const depositReadyTimestamp = moment(userInfo[1].toNumber() * 1000).add(90, 'days');
    const addTransaction = useTransactionAdder()

    // They have already selected option 1
    if (userInfo[4].gt(0)) {
        if (userInfo[5] === "0x0000000000000000000000000000000000000000") {
            return (
                <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                    <Wrapper id="swap-page">
                        <div className="inline-block">You have aleady selected Option 1.</div>
                    </Wrapper>
                </div>
            )
        }

        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">You have aleady selected Option 2.</div>
                </Wrapper>
            </div>
        )
    }

    if (depositReadyTimestamp.isAfter(now)) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">
                        Your BOMB deposit is not yet ready to be unlocked. You must wait
                        until {depositReadyTimestamp.format('MMM Do YYYY HH:mm')} to select your option.
                    </div>
                </Wrapper>
            </div>
        )
    }

    return (
        <>
            <div className="mt-3 bg-dark-900 shadow-swap-blue-glow text-center rounded p-3">
                <div className="border-b border-b-gray-500 pb-1 mb-1">
                    <div>Initial BOMB Locked:</div>
                    <div>{formatBalance(userInfo[2], 18, 4)}</div>
                </div>
                <div>
                    <div>Claimable BOMB:</div>
                    <div>{formatBalance(userInfo[3], 18, 4)}</div>
                </div>
            </div>
            <div className="mt-3 text-lg">
                Choose option:
            </div>
            <div className="mt-5 grid grid-cols-2 text-lg text-center gap-x-5">
                <ButtonPrimary onClick={() => {
                    (async () => {
                        if (!bombLockingClaimContract) return
                        const txReceipt = await bombLockingClaimContract.selectOption(1)
                        addTransaction(txReceipt, {
                            summary: `Select Option 1 for BOMB Bonus unlock`
                        })
                    })();
                }}>
                    <div>
                        Option 1
                    </div>
                </ButtonPrimary>
                <ButtonPrimary onClick={() => {
                    (async () => {
                        if (!bombLockingClaimContract) return
                        const txReceipt = await bombLockingClaimContract.selectOption(2)
                        addTransaction(txReceipt, {
                            summary: `Select Option 2 for BOMB Bonus unlock`
                        })
                    })();
                }}>
                    <div>
                        Option 2
                    </div>
                </ButtonPrimary>
            </div>
        </>
    )
}