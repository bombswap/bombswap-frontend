import React from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Helmet } from 'react-helmet'
import XSushiSign from '../../assets/images/xsushi-text-sign.png'
import InfoCard from './InfoCard'
import APRCard from './APRCard'
import StakeCard from './StakeCard'
import BalanceCard from './BalanceCard'
import { ChainId } from '@bombswap/sdk'
import { SUSHI, XSUSHI } from '../../constants'
import useTokenBalance from '../../hooks/useTokenBalance'

const mockData = {
    sushiEarnings: 345.27898,
    weightedApr: 15.34
}

export default function XSushi() {
    const { account, chainId } = useActiveWeb3React()

    const sushiBalance = useTokenBalance(SUSHI[ChainId.BOMB]?.address ?? '')
    const xSushiBalance = useTokenBalance(XSUSHI?.address ?? '')

    return (
        <>
            <Helmet>
                <title>XBombSwap | BOMBSWAP DEX</title>
            </Helmet>
            <div className="flex flex-col w-full min-h-fitContent">
                <div className="flex justify-center mb-6">
                    <InfoCard />
                    <div className="justify-center hidden ml-6 md:flex align-center w-72">
                        {/* <img src={XSushiSign} alt={'xsushi sign'} /> */}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="flex flex-col w-full max-w-xl">
                        <div className="mb-4">
                            <APRCard />
                        </div>
                        <div>
                            <StakeCard sushiBalance={sushiBalance} xSushiBalance={xSushiBalance} />
                        </div>
                    </div>
                    <div className="hidden ml-6 md:block w-72">
                        <BalanceCard
                            sushiEarnings={mockData.sushiEarnings}
                            xSushiBalance={xSushiBalance}
                            sushiBalance={sushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="flex justify-center w-full max-w-xl mt-6 mb-20 md:hidden">
                        <BalanceCard
                            sushiEarnings={mockData.sushiEarnings}
                            xSushiBalance={xSushiBalance}
                            sushiBalance={sushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
