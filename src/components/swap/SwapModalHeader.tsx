import { TokenAmount, Trade, TradeType } from '@peghub/sdk'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { ButtonPrimary } from '../ButtonLegacy'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapShowAcceptChanges, TruncatedText } from './styleds'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { usePeghubTokenContract } from "../../hooks/useContract";
import { Contract } from "@ethersproject/contracts";

export default function SwapModalHeader({
    trade,
    allowedSlippage,
    recipient,
    showAcceptChanges,
    onAcceptChanges
}: {
    trade: Trade
    allowedSlippage: number
    recipient: string | null
    showAcceptChanges: boolean
    onAcceptChanges: () => void
}) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
        trade,
        allowedSlippage
    ])
    const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
    const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

    const theme = useContext(ThemeContext)


    const [tax, setTax] = useState<number>(0)
    const inputTokenERC20 = usePeghubTokenContract(
        trade && trade.inputAmount instanceof TokenAmount ? trade.inputAmount.token.address : '',
        false,
    )
    useEffect(() => {
        fetchTax(trade, inputTokenERC20)
    }, [trade, inputTokenERC20])

    const fetchTax = async (ptrade: Trade, pinputTokenERC20: Contract | null) => {
        if (
            pinputTokenERC20 &&
            ptrade &&
            ptrade.inputAmount instanceof TokenAmount &&
            (ptrade.inputAmount.token.symbol === 'CZBNB' ||
                ptrade.inputAmount.token.symbol === 'CZBOMB' ||
                ptrade.inputAmount.token.symbol === 'CZEMP' ||
                ptrade.inputAmount.token.symbol === 'CZBUSD' ||
                ptrade.inputAmount.token.symbol === 'SNOWAVAX' ||
                ptrade.inputAmount.token.symbol === 'SNOWSOL' ||
                ptrade.inputAmount.token.symbol === 'SNOWLINK' ||
                ptrade.inputAmount.token.symbol === 'bitBTC' ||
                ptrade.inputAmount.token.symbol === 'bitADA' ||
                ptrade.inputAmount.token.symbol === 'bitATOM' ||
                ptrade.inputAmount.token.symbol === 'bitDOT')
        ) {
            const tokenUpdatedPrice = Number((await pinputTokenERC20.callStatic.getTokenUpdatedPrice()).toString())
            let taxRate = null
            let burnRate = null
            if (tokenUpdatedPrice < 1e18) {
                taxRate = Number((await pinputTokenERC20.callStatic.taxRate()).toString())
                burnRate = Number((await pinputTokenERC20.callStatic.burnRate()).toString())
                setTax(taxRate + burnRate)
            } else if (tax !== 0) {
                setTax(0)
            }
        } else if (tax !== 0) {
            setTax(0)
        }
    }

    return (
        <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
            <RowBetween align="flex-end">
                <RowFixed gap={'0px'}>
                    <CurrencyLogo currency={trade.inputAmount.currency} size={'24px'} style={{ marginRight: '12px' }} />
                    <TruncatedText
                        fontSize={24}
                        fontWeight={500}
                        color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
                    >
                        {trade.inputAmount.toSignificant(6)}
                    </TruncatedText>
                </RowFixed>
                <RowFixed gap={'0px'}>
                    <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                        {trade.inputAmount.currency.getSymbol(chainId)}
                    </Text>
                </RowFixed>
            </RowBetween>
            <RowFixed>
                <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
            </RowFixed>
            <RowBetween align="flex-end">
                <RowFixed gap={'0px'}>
                    <CurrencyLogo
                        currency={trade.outputAmount.currency}
                        size={'24px'}
                        style={{ marginRight: '12px' }}
                    />
                    <TruncatedText
                        fontSize={24}
                        fontWeight={500}
                        color={
                            priceImpactSeverity > 2
                                ? theme.red1
                                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                                ? theme.primary1
                                : ''
                        }
                    >
                        {trade.outputAmount.toSignificant(6)}
                    </TruncatedText>
                </RowFixed>
                <RowFixed gap={'0px'}>
                    <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                        {trade.outputAmount.currency.getSymbol(chainId)}
                    </Text>
                </RowFixed>
            </RowBetween>
            {showAcceptChanges ? (
                <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
                    <RowBetween>
                        <RowFixed>
                            <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
                            <TYPE.main color={theme.primary1}> {i18n._(t`Price Updated`)}</TYPE.main>
                        </RowFixed>
                        <ButtonPrimary
                            style={{
                                padding: '.5rem',
                                width: 'fit-content',
                                fontSize: '0.825rem',
                                borderRadius: '12px'
                            }}
                            onClick={onAcceptChanges}
                        >
                            {i18n._(t`Accept`)}
                        </ButtonPrimary>
                    </RowBetween>
                </SwapShowAcceptChanges>
            ) : null}
            <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                    <TYPE.italic textAlign="left" style={{ width: '100%' }}>
                        <Trans>
                            Output is estimated. You will receive at least{' '}
                            <b>
                                {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
                                {trade.outputAmount.currency.getSymbol(chainId)}
                            </b>{' '}
                            or the transaction will revert.
                        </Trans>
                    </TYPE.italic>
                ) : (
                    <TYPE.italic textAlign="left" style={{ width: '100%' }}>
                        <Trans>
                            Input is estimated. You will sell at most{' '}
                            <b>
                                {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
                                {trade.inputAmount.currency.getSymbol(chainId)}
                            </b>{' '}
                            or the transaction will revert.
                        </Trans>
                    </TYPE.italic>
                )}
                {tax > 0 && (
                    <RowBetween align="center">
                        <div className="text-secondary text-sm">
                              <span style={{ color: 'red' }}>
                                This transaction will incur a {tax / 100}% tax. Please set your slippage accordingly.
                              </span>
                        </div>
                    </RowBetween>
                )}
            </AutoColumn>
            {recipient !== null ? (
                <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
                    <TYPE.main>
                        <Trans>
                            Output will be sent to{' '}
                            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
                        </Trans>
                    </TYPE.main>
                </AutoColumn>
            ) : null}
        </AutoColumn>
    )
}
