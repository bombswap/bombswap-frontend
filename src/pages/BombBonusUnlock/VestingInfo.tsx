import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Wrapper } from "../../components/swap/styleds";
import Loader from "../../components/Loader";
import { formatBalance } from "../../utils";
import { ButtonPrimary } from "../../components/ButtonLegacy";
import { useTransactionAdder } from "../../state/transactions/hooks";

export default function VestingInfo({
                                        account,
                                        bombLockingClaimContract
                                    }: { account: string, bombLockingClaimContract: any }) {
    const addTransaction = useTransactionAdder()
    const [userStats, setUserStats] = useState<any>(null)

    useEffect(() => {
        setUserStats(null)

        const updateUserStats = async () => {
            bombLockingClaimContract.userStats(account).then((res: any) => {
                setUserStats((prevUserInfo: any) => {
                    // if (prevUserInfo && prevUserInfo[4].toString() === res[4].toString()) {
                    //     return prevUserInfo
                    // }

                    return res;
                })
            }).catch((err: any) => {
                setUserStats([0]);
            });
        }
        const interval = setInterval(updateUserStats, 10000);
        updateUserStats()

        return () => {
            clearInterval(interval)
        }
    }, [account]);

    if (!userStats) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">
                        <Loader />
                    </div>
                </Wrapper>
            </div>
        )
    }

    const canClaim = userStats[6].gt(0) || userStats[11].gt(0) || userStats[16].gt(0) || userStats[21].gt(0)

    return (
        <>
            <Helmet>
                <title>BOMB Bonus unlock | BOMB</title>
                <meta
                    name="description"
                    content="BOMB Bonus unlock"
                />
            </Helmet>

            <div className="mb-5 text-2xl font-bold ">BOMB Bonus unlock</div>

            <div className="mb-5 w-1/2 text-center">
                <div className="mb-5">
                    You have selected Option 2. Information about your vested and claimable amounts will appear below:
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-4 lg:gap-x-5">
                <div className="bg-dark-900 shadow-swap-blue-glow text-center rounded p-2">
                    <div className="border-b border-b-gray-500 pb-1 mb-1">BOMB/PHUB</div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Initial LPs:</div>
                        <div>{formatBalance(userStats[4], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Current LPs:</div>
                        <div>{formatBalance(userStats[5], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Claimable:</div>
                        <div>{formatBalance(userStats[6], 18, 4)}</div>
                    </div>
                    <div>
                        <div>Claimed:</div>
                        <div>{formatBalance(userStats[7], 18, 4)}</div>
                    </div>
                </div>
                <div className="bg-dark-900 shadow-swap-blue-glow text-center rounded p-2">
                    <div className="border-b border-b-gray-500 pb-1 mb-1">BOMB/bitSHARE</div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Initial LPs:</div>
                        <div>{formatBalance(userStats[9], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Current LPs:</div>
                        <div>{formatBalance(userStats[10], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Claimable:</div>
                        <div>{formatBalance(userStats[11], 18, 4)}</div>
                    </div>
                    <div>
                        <div>Claimed:</div>
                        <div>{formatBalance(userStats[12], 18, 4)}</div>
                    </div>
                </div>
                <div className="bg-dark-900 shadow-swap-blue-glow text-center rounded p-2">
                    <div className="border-b border-b-gray-500 pb-1 mb-1">BOMB/CZshare</div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Initial LPs:</div>
                        <div>{formatBalance(userStats[14], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Current LPs:</div>
                        <div>{formatBalance(userStats[15], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Claimable:</div>
                        <div>{formatBalance(userStats[16], 18, 4)}</div>
                    </div>
                    <div>
                        <div>Claimed:</div>
                        <div>{formatBalance(userStats[17], 18, 4)}</div>
                    </div>
                </div>
                <div className="bg-dark-900 shadow-swap-blue-glow text-center rounded p-2">
                    <div className="border-b border-b-gray-500 pb-1 mb-1">BOMB/BOMBSWAP</div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Initial LPs:</div>
                        <div>{formatBalance(userStats[19], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Current LPs:</div>
                        <div>{formatBalance(userStats[20], 18, 4)}</div>
                    </div>
                    <div className="border-b border-b-gray-500 pb-1 mb-1">
                        <div>Claimable:</div>
                        <div>{formatBalance(userStats[21], 18, 4)}</div>
                    </div>
                    <div>
                        <div>Claimed:</div>
                        <div>{formatBalance(userStats[22], 18, 4)}</div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <ButtonPrimary onClick={() => {
                    (async () => {
                        if (!bombLockingClaimContract) return
                        const txReceipt = await bombLockingClaimContract.releaseTokens(account)
                        addTransaction(txReceipt, {
                            summary: `Claimed BOMB Bonus tokens`
                        })
                    })();
                }}>
                    <div>
                        Claim
                    </div>
                </ButtonPrimary>
            </div>
        </>
    )
}
