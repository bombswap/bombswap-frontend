import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { CurrencyAmount, Token, TokenAmount } from '@bombswap/sdk'
import Column, { AutoColumn } from '../../components/Column'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useAllTokens } from '../../hooks/Tokens'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'

import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/swap/actions'
import { Helmet } from 'react-helmet'
import Loader from '../../components/Loader'
import ProgressSteps from '../../components/ProgressSteps'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { isAddress } from '../../utils'
import { useBombchainBridgeContract, useTokenContract } from '../../hooks/useContract'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import QRCode from 'react-qr-code'

export default function Bridge() {
    const { i18n } = useLingui()

    const { account, chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    const { typedValue } = useSwapState()
    const { currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()

    const parsedAmounts = {
        [Field.INPUT]: parsedAmount
    }

    const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput]
    )

    const formattedAmounts = {
        [Field.INPUT]: typedValue ?? ''
    }

    const bombChainId = 2300
    const destinationChainId = 56
    const bridgeContractAddress = '0x2a06800f3F935024d327D6C632Ca000f00B9CFEd'
    const bridgeIn = String(chainId) !== String(bombChainId)
    const bridgeOut = String(chainId) === String(bombChainId)

    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

    const handleMaxInput = useCallback(() => {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }, [maxAmountInput, onUserInput])

    const allTokens = useAllTokens()
    const [availableNetworks, setAvailableNetworks] = useState<string[]>([])
    const [availableNetworkObjects, setAvailableNetworkObjects] = useState<any>({})
    const [availableTokens, setAvailableTokens] = useState<Token[]>([])
    const [availableAnkrTokens, setAvailableAnkrTokens] = useState<Token[]>([])
    const [depositAddress, setDepositAddress] = useState<string>('')

    useEffect(() => {
        if (!account || !chainId) {
            return
        }
        fetch('https://api.bombchain.com/networks')
            .then(res => res.json())
            .then(data => {
                const networks = data.networks.filter(
                    (item: { chainId: number; evmCompatible: boolean }) => item.evmCompatible
                )
                setAvailableNetworks(networks.map((item: any) => item.chainId))

                const availableNetworks: any = {}
                for (const network of networks) {
                    availableNetworks[String(network.chainId)] = network
                }
                setAvailableNetworkObjects(availableNetworks)
            })
        fetch('https://api.bombchain.com/deposit_assets')
            .then(res => res.json())
            .then(data => {
                const tokens: Token[] = []
                for (const asset in data.depositAssets) {
                    // Bridge in
                    if (
                        String(chainId) !== String(bombChainId) &&
                        String(data.depositAssets[asset].blockchain.chainId) === String(chainId)
                    ) {
                        const address = isAddress(data.depositAssets[asset].assetContract)
                        if (address && !tokens.includes(allTokens[address])) {
                            tokens.push(allTokens[address])
                        }
                        // Bridge out
                    } else if (
                        String(chainId) === String(bombChainId) &&
                        String(data.depositAssets[asset].blockchain.chainId) === String(destinationChainId)
                    ) {
                        const address = isAddress(data.depositAssets[asset].bombchainAssetContract)
                        if (address && !tokens.includes(allTokens[address])) {
                            tokens.push(allTokens[address])
                        }
                    }
                }
                setAvailableTokens(tokens)

                const ankrTokens: Token[] = []
                // if (String(chainId) === '56') {
                //     let address = isAddress('0x522348779DCb2911539e76A1042aA922F9C47Ee3');
                //     if (address && !ankrTokens.includes(allTokens[address])) {
                //         ankrTokens.push(allTokens[address])
                //     }
                //
                //     address = isAddress('0x55d398326f99059fF775485246999027B3197955');
                //     if (address && !ankrTokens.includes(allTokens[address])) {
                //         ankrTokens.push(allTokens[address])
                //     }
                //
                //     address = isAddress('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d');
                //     if (address && !ankrTokens.includes(allTokens[address])) {
                //         ankrTokens.push(allTokens[address])
                //     }
                // }

                setAvailableAnkrTokens(ankrTokens)
            })
    }, [chainId, account])

    useEffect(() => {
        if (String(chainId) === String(bombChainId)) {
            return // No deposit address when bridging out
        }
        if (!account || !chainId || !availableNetworkObjects || !availableNetworkObjects[String(chainId)]) {
            return
        }
        fetch('https://api.bombchain.com/address/' + availableNetworkObjects[String(chainId)].slug + '/' + account)
            .then(res => res.json())
            .then(async data => {
                setDepositAddress(data.depositAddress.address)
            })
    }, [chainId, account, availableNetworkObjects])

    const inputCurrency = currencies[Field.INPUT] as WrappedTokenInfo
    const inputAmount = parsedAmounts[Field.INPUT] as CurrencyAmount
    const tokenAddress = inputCurrency && inputCurrency.address ? inputCurrency.address : undefined
    const addTransaction = useTransactionAdder()
    const contract = useTokenContract(tokenAddress)
    const bridgeContract = useBombchainBridgeContract(bridgeContractAddress)

    const isValid = bridgeIn || !!inputCurrency
    const [approval, approveCallback] = useApproveCallback(
        new TokenAmount(
            inputCurrency ?? new Token(2300, '0xaC029BF2871b3f810AAbF836Adc4F89369027971', 18, 'BOMBSWAP', ''),
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        ),
        bridgeContractAddress
    )

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    const showApproveFlow =
        bridgeOut &&
        !!inputCurrency &&
        (approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING ||
            (approvalSubmitted && approval === ApprovalState.APPROVED))

    const handleInputSelect = useCallback(
        inputCurrency => {
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, inputCurrency)
        },
        [onCurrencySelection]
    )

    const handleBridge = async () => {
        if (!contract || !bridgeContract || !inputAmount) {
            alert('Contract is null')
            return
        }

        if (!availableNetworkObjects[String(chainId)].slug) {
            alert('Blockchain ' + chainId + ' slug not found')
            return
        }

        if (availableTokens.includes(inputCurrency)) {
            if (bridgeIn) {
                if (!depositAddress) {
                    alert('Deposit address is not available')
                    return
                }

                const txReceipt = await contract.transfer(depositAddress, `0x${inputAmount.raw.toString(16)}`)
                addTransaction(txReceipt, {
                    summary: `Bridge ${inputAmount.toSignificant(6)} ${inputCurrency.symbol} to BOMBChain`
                })
            } else {
                const txReceipt = await bridgeContract.bridgeAsset(
                    tokenAddress,
                    `0x${inputAmount.raw.toString(16)}`,
                    account,
                    String(destinationChainId)
                )
                addTransaction(txReceipt, {
                    summary: `Bridge ${inputAmount.toSignificant(6)} ${inputCurrency.symbol} to ${
                        availableNetworkObjects[String(destinationChainId)].name
                    }`
                })
            }
        } else if (availableAnkrTokens.includes(inputCurrency)) {
            // const spender = 0x64bb12c65ba956c5f0a2f3b58027314e93915aa9;

            // deposit transaction
            // bsc: https://bscscan.com/tx/0x5c941b99b959eaf49cb24a90bc880e5738d39ec037a4432f54994a2a8f5c3d67
            // withdraw transaction (claim)
            // bomb: 0xe408e9812bc28a2488ad1e4a8ce6c2265ccabad23c91f58225351d4ec3c55dad
            alert('ankr')
        } else {
            alert('Token is not available for bridging')
        }
    }

    if (!account) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">Please connect your wallet to use the bridge.</div>
                    <div className="mt-5">
                        <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                    </div>
                </Wrapper>
            </div>
        )
    }

    if (!availableNetworks.includes(String(chainId))) {
        return (
            <div className="w-full max-w-2xl text-center rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <div className="inline-block">This chain is not currently supported for bridging to BOMBChain.</div>
                </Wrapper>
            </div>
        )
    }

    if (
        !availableNetworks ||
        availableNetworks.length <= 0 ||
        (String(chainId) !== String(bombChainId) && !depositAddress)
    ) {
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

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Bridge`)} | BOMBSWAP DEX</title>
                <meta
                    name="description"
                    content="BOMBSwap allows for bridging of ERC20 compatible tokens to BOMBChain"
                />
            </Helmet>

            <div className="mb-5 text-2xl font-bold ">Bridge Assets Between BOMB Chain and BSC</div>

            <div className="w-1/2 mb-5 text-center">
                Please note that currently BTCB and BUSD are supported on the BOMB bridge. BOMB and numerous other
                options are available on the ANKR powered bridge.
            </div>

            <div className="w-full max-w-2xl rounded bg-dark-900 shadow-swap-blue-glow">
                <Wrapper id="swap-page">
                    <AutoColumn gap={'md'}>
                        <CurrencyInputPanel
                            label={i18n._(t`Bridge:`)}
                            value={formattedAmounts[Field.INPUT]}
                            showMaxButton={!atMaxAmountInput}
                            currency={
                                [...availableTokens, ...availableAnkrTokens].includes(inputCurrency)
                                    ? currencies[Field.INPUT]
                                    : undefined
                            }
                            onUserInput={handleTypeInput}
                            onMax={handleMaxInput}
                            onCurrencySelect={handleInputSelect}
                            onlySpecificTokens={[...availableTokens, ...availableAnkrTokens]}
                            id="swap-currency-input"
                        />
                    </AutoColumn>
                    <BottomGrouping>
                        {!account ? (
                            <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                        ) : !currencies[Field.INPUT] ||
                          !formattedAmounts[Field.INPUT] ||
                          Number(formattedAmounts[Field.INPUT]) <= 0 ? (
                            <ButtonError disabled={true}>
                                <Text fontSize={16} fontWeight={500}>
                                    {i18n._(t`Select a token and enter an amount`)}
                                </Text>
                            </ButtonError>
                        ) : inputAmount && maxAmountInput && inputAmount.greaterThan(maxAmountInput) ? (
                            <ButtonError disabled={true}>
                                <Text fontSize={16} fontWeight={500}>
                                    {i18n._(t`Amount exceeds your available balance`)}
                                </Text>
                            </ButtonError>
                        ) : showApproveFlow ? (
                            <RowBetween>
                                <ButtonConfirmed
                                    onClick={approveCallback}
                                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                                    width="48%"
                                    altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                                    confirmed={approval === ApprovalState.APPROVED}
                                >
                                    {approval === ApprovalState.PENDING ? (
                                        <AutoRow gap="6px" justify="center">
                                            Approving <Loader stroke="white" />
                                        </AutoRow>
                                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                                        i18n._(t`Approved`)
                                    ) : (
                                        i18n._(t`Approve ${currencies[Field.INPUT]?.getSymbol(chainId)}`)
                                    )}
                                </ButtonConfirmed>
                                <ButtonError
                                    onClick={() => {
                                        handleBridge()
                                    }}
                                    width="48%"
                                    id="swap-button"
                                    disabled={!isValid || approval !== ApprovalState.APPROVED}
                                >
                                    <Text fontSize={16} fontWeight={500}>
                                        {i18n._(t`Bridge`)}
                                    </Text>
                                </ButtonError>
                            </RowBetween>
                        ) : (
                            <ButtonPrimary
                                onClick={() => {
                                    handleBridge()
                                }}
                            >
                                {i18n._(t`Bridge`)}
                            </ButtonPrimary>
                        )}
                        {showApproveFlow && (
                            <Column style={{ marginTop: '1rem' }}>
                                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                            </Column>
                        )}
                    </BottomGrouping>
                </Wrapper>
            </div>

            {String(chainId) !== String(bombChainId) && (
                <div className="mt-10 text-lg text-center">
                    <div>
                        You can also send supported tokens to your deposit address. Ensure you are sending a token in
                        the list above or your tokens may be unrecoverable.
                    </div>
                    <div>{depositAddress}</div>
                    <div
                        className="mx-auto mt-10"
                        style={{
                            height: 'auto',
                            maxWidth: 150,
                            width: '100%',
                            background: 'white',
                            padding: '8px'
                        }}
                    >
                        <QRCode
                            size={256}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            value={depositAddress}
                            viewBox={'0 0 256 256'}
                        />
                    </div>
                </div>
            )}
            <div className="mt-10 text-lg text-center">
                Bridge BOMB, USDT, USDC, CZshare, bitSHARE and PHUB at the ANKR Bridge!
            </div>
            <div className="mt-3 text-lg text-center">
                <ButtonPrimary>
                    <a
                        // style={{ textDecoration: 'underline' }}
                        href="https://chainscanner.xyz/ankr/appchains/bomb/bridge/"
                    >
                        Visit the ANKR Bridge!
                    </a>
                </ButtonPrimary>
            </div>
        </>
    )
}
