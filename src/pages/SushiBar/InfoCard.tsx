import React from 'react'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const StyledLink = styled.a`
    text-decoration: none;
    cursor: pointer;
    font-weight: bold;

    :hover {
        text-decoration: underline;
    }

    :focus {
        outline: none;
        text-decoration: underline;
    }

    :active {
        text-decoration: none;
    }
`

export default function InfoCard() {
    const { i18n } = useLingui()
    return (
        <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
            <div className="flex max-w-lg">
                <div className="self-end mb-3 font-bold text-body md:text-h5 text-high-emphesis md:mb-7">
                    {i18n._(t`Maximize yield by staking BOMBSWAP for xBOMBSWAP`)}
                </div>
                {/* <div className="self-start pl-6 pr-3 mb-1 min-w-max md:hidden">
                    <img src={XSushiSignSmall} alt="xsushi sign" />
                </div> */}
            </div>
            <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-caption md:mb-4 md:pr-0">
                {t`For every swap on the exchange, 0.05% of the swap fees are distributed as BOMBSWAP
                proportional to your share of staked tokens. When your BOMBSWAP is staked, you receive
                xBOMBSWAP in return for voting rights and a fully composable token that can interact with other protocols.
                Your xBOMBSWAP is continuously compounding, when you unstake you will receive all the originally deposited
                BOMBSWAP and any additional from fees.`}
            </div>
            {/* <div className="flex">
                <div className="mr-14 md:mr-9">
                    <StyledLink className="text-body whitespace-nowrap text-caption2 md:text-lg md:leading-5">
                        Enter the Kitchen
                    </StyledLink>
                </div>
                <div>
                    <StyledLink className="text-body whitespace-nowrap text-caption2 md:text-lg md:leading-5">
                        Tips for using xSUSHI
                    </StyledLink>
                </div>
            </div> */}
        </div>
    )
}
