import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useWalletModalToggle } from '../../state/application/hooks'

import { Helmet } from 'react-helmet'
import Loader from '../../components/Loader'
import { ThemeContext } from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { isAddress } from '../../utils'
import { useBombchainBridgeContract, useContract, useTokenContract } from '../../hooks/useContract'
import Bomb_Locking_Claim_ABI from "../../constants/abis/BombLockingClaim.json";
import OptionChooser from "./OptionChooser";
import VestingInfo from "./VestingInfo";

export default function BombBonusUnlock() {
    const { i18n } = useLingui()

    const bombLockingClaimContract = useContract("0x1849B47cd459Cc5C92888F7e6d2F719FF482332E", Bomb_Locking_Claim_ABI)
    const [userInfo, setUserInfo] = useState<any>(null)

    const { account, chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    useEffect(() => {
        setUserInfo(null)

        if (!account) {
            return
        }

        if (!bombLockingClaimContract) {
            return
        }

        const updateUserInfo = async () => {
            bombLockingClaimContract.userByAddress(account).then((res: any) => {
                setUserInfo((prevUserInfo: any) => {
                    if (prevUserInfo && prevUserInfo[4].toString() === res[4].toString()) {
                        return prevUserInfo
                    }

                    return res;
                })
            }).catch((err: any) => {
                setUserInfo([0]);
            });
        }
        const interval = setInterval(updateUserInfo, 10000);
        updateUserInfo()

        return () => {
            clearInterval(interval)
        }
    }, [account]);

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    if (!account) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">Please connect your wallet to use the BOMB Unlock Bonus.</div>
                    <div className="mt-5">
                        <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                    </div>
                </Wrapper>
            </div>
        )
    }

    if (String(chainId) !== "2300") {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">This functionality is only available on BOMBChain.</div>
                </Wrapper>
            </div>
        )
    }

    if (!userInfo) {
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

    if (userInfo[0] === 0) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">This wallet is not eligible to receive BOMB Unlock Bonus.</div>
                </Wrapper>
            </div>
        )
    }

    // They have already selected an option
    if (userInfo[4].gt(0)) {
        if (userInfo[5] !== "0x0000000000000000000000000000000000000000") {
            return <VestingInfo account={account} bombLockingClaimContract={bombLockingClaimContract} />
        }
    }

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

            <div className="mb-5 lg:w-1/2 text-left">
                <div className="mb-5">Option 1) Receive all of your initially deposited BOMB immediately upon unlock and
                    forfeit your bonus BOMB tokens. You will still receive BOMBSWAP tokens as a reward for your
                    participation in the lock bonus!
                </div>

                <div className="mb-5">Option 2) Receive 50% of your initially deposited BOMB back immediately. The
                    remainder of your BOMB (other 50% of initially deposited + ALL Bonus BOMB) is immediately put into
                    auto vaults where the entire balance earns APR’s during its stake period. These stake positions will
                    be vested over the course of 6 months with small portions being released daily. A few important
                    points on this option. Firstly, this option benefits the BOMB ecosystem as a whole as it helps BOMB
                    asset prices rise as a function of how the LPs work. Secondly, with more and more people selecting
                    option 2, it’s very likely that the price of the assets in these vaults will continue to rise.
                    Finally, zapping all of this BOMB into these specific LPs does not lower the price of BOMB.
                </div>

                Option 2 BOMB will be put to work in the following auto vaults:

                <ul className="list-disc pl-4">
                    <li>50% BOMB/PHUB</li>
                    <li>20% BOMB/bitSHARE</li>
                    <li>20% BOMB/CZshare</li>
                    <li>10% BOMB/BOMBSWAP</li>
                </ul>
            </div>

            <OptionChooser userInfo={userInfo} bombLockingClaimContract={bombLockingClaimContract} />
        </>
    )
}
