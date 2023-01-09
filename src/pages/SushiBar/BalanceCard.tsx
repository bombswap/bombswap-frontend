import { BalanceProps } from '../../hooks/useTokenBalance'
import React from 'react'
import BombSwap from '../../assets/images/bombswap.png'
import XBombSwap from '../../assets/images/xbombswap.png'
import Bomb from '../../assets/images/bomb.png'
import { formatFromBalance } from '../../utils'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

interface BalanceCardProps {
    sushiEarnings?: number
    xSushiBalance: BalanceProps
    sushiBalance: BalanceProps
    weightedApr?: number
}

export default function BalanceCard({
    xSushiBalance,
    sushiBalance,
    sushiEarnings = 0,
    weightedApr = 0
}: BalanceCardProps) {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()
    return (
        <div className="flex flex-col w-full px-4 pt-6 pb-5 rounded bg-dark-1000 md:px-8 md:pt-7 md:pb-9">
            <div className="flex flex-wrap">
                <div className="flex flex-col flex-grow md:mb-14">
                    <p className="mb-3 text-lg font-bold md:text-h5 md:font-medium text-high-emphesis">
                        {i18n._(t`Balance`)}
                    </p>
                    <div className="flex items-center">
                        <img className="w-10 md:w-16 -ml-1 mr-1 md:mr-2 -mb-1.5" src={XBombSwap} alt="XBombSwap" />
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-caption2 md:text-lg text-high-emphesis">
                                {formatFromBalance(xSushiBalance.value)}
                            </p>
                            <p className="text-caption2 md:text-caption text-primary">xBOMBSWAP</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-grow">
                    <div className="flex mb-3 ml-8 flex-nowrap md:ml-0">
                        <p className="text-lg font-bold md:text-h5 md:font-medium text-high-emphesis">
                            {i18n._(t`Unstaked`)}
                        </p>
                        {/* <img className="w-4 ml-2 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} /> */}
                    </div>
                    <div className="flex items-center ml-8 md:ml-0">
                        <img className="w-10 md:w-16 -ml-1 mr-1 md:mr-2 -mb-1.5" src={BombSwap} alt="BombSwap" />
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-caption2 md:text-lg text-high-emphesis">
                                {formatFromBalance(sushiBalance.value)}
                                {/* {sushiEarnings.toPrecision(7)} */}
                            </p>
                            <p className="text-caption2 md:text-caption text-primary">BOMBSWAP</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full mb-4 mt-7 md:mb-0">
                    {/* <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 flex-nowrap">
                            <p className="font-bold text-caption md:text-lg text-high-emphesis">Weighted APR</p>
                            <img className="w-4 ml-2 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} />
                        </div>
                        <div className="flex flex-1 md:flex-initial">
                            <p className="ml-5 text-caption text-primary md:ml-0">{`${weightedApr}%`}</p>
                        </div>
                    </div> */}
                    {/* {account && (
                        <a
                            href={`https://analytics.sushi.com/users/${account}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={`
                                flex flex-grow justify-center items-center
                                h-14 mt-6 rounded
                                bg-dark-700 text-high-emphesis
                                focus:outline-none focus:ring hover:bg-opacity-80
                                text-caption2 font-bold cursor-pointer
                            `}
                        >
                            {i18n._(t`Your SushiBar Stats`)}
                        </a>
                    )} */}
                </div>
            </div>
        </div>
    )
}
