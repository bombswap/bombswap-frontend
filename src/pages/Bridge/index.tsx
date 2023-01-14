import { ApprovalState } from '../../hooks/useApproveCallback'
import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { CurrencyAmount, Token } from '@bombswap/sdk'
import Column, { AutoColumn } from '../../components/Column'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useAllTokens } from '../../hooks/Tokens'
import {
    useDerivedSwapInfo,
    useSwapActionHandlers
} from '../../state/swap/hooks'
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
import { isAddress } from "../../utils";
import { useTokenContract } from "../../hooks/useContract";
import { WrappedTokenInfo } from "../../state/lists/hooks";
import { useTransactionAdder } from '../../state/transactions/hooks';
import QRCode from "react-qr-code";


export default function Bridge() {
    const { i18n } = useLingui()

    const { account, chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    const { currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

    const parsedAmounts = {
            [Field.INPUT]: parsedAmount
        };

    const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
    const isValid = !swapInputError

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput]
    )

    const formattedAmounts = {
        [Field.INPUT]: parsedAmounts[Field.INPUT]?.toExact() ?? ''
    }
    const [approval, setApproval] = useState<number>(ApprovalState.APPROVED);

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    const showApproveFlow =
        !swapInputError &&
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

    const handleMaxInput = useCallback(() => {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }, [maxAmountInput, onUserInput]);

    const allTokens = useAllTokens();
    const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);
    const [availableNetworkObjects, setAvailableNetworkObjects] = useState<any>({});
    const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
    const [depositAddress, setDepositAddress] = useState<string>("");
    useEffect(() => {
        if (!account || !chainId) {
            return;
        }
        fetch('https://api.bombchain.com/deposit_assets').then(res => res.json()).then(data => {
            const networks: any = [];
            const networkObjects: any = {};
            for (const asset in data.depositAssets) {
                if (!networks.includes(String(data.depositAssets[asset].blockchain.chainId))) {
                    networks.push(String(data.depositAssets[asset].blockchain.chainId));
                    networkObjects[String(data.depositAssets[asset].blockchain.chainId)] = data.depositAssets[asset].blockchain;
                }
            }
            setAvailableNetworks(networks);
            setAvailableNetworkObjects(networkObjects);

            const tokens: Token[] = [];
            for (const asset in data.depositAssets) {
                if (String(data.depositAssets[asset].blockchain.chainId) === String(chainId)) {
                    const address = isAddress(data.depositAssets[asset].assetContract);
                    if (address && !tokens.includes(allTokens[address])) {
                        tokens.push(allTokens[address]);
                    }
                }
            }
            setAvailableTokens(tokens);
        });
    }, [chainId, account]);

    useEffect(() => {
        if (!account || !chainId || !availableNetworkObjects || !availableNetworkObjects[String(chainId)]) {
            return;
        }
        fetch('https://api.bombchain.com/address/' + availableNetworkObjects[String(chainId)].slug + '/' + account).then(res => res.json()).then(async data => {
            setDepositAddress(data.depositAddress.address);
        });
    }, [chainId, account, availableNetworkObjects]);

    const inputCurrency = currencies[Field.INPUT] as WrappedTokenInfo;
    const inputAmount = parsedAmounts[Field.INPUT] as CurrencyAmount;
    const tokenAddress = inputCurrency && inputCurrency.address ? inputCurrency.address : undefined;
    const addTransaction = useTransactionAdder();
    const contract = useTokenContract(tokenAddress);
    const handleBridge = async () => {
        if (!contract || !inputAmount) {
            alert('Contract is null');
            return;
        }

        if (!availableNetworkObjects[String(chainId)].slug) {
            alert('Blockchain ' + chainId + ' slug not found');
            return;
        }

        if (!depositAddress) {
            alert('Deposit address is not available');
            return;
        }

        const txReceipt = await contract.transfer(depositAddress, `0x${inputAmount.raw.toString(16)}`);
        addTransaction(txReceipt, {
            summary: `Bridge ${inputAmount.toSignificant(6)} ${inputCurrency.symbol} to BOMBChain`
        })
    };

    if (!account) {
        return (
            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-2xl rounded text-center">
                <Wrapper id="swap-page">
                    <div className="inline-block">
                        Please connect your wallet to use the bridge.
                    </div>
                    <div className="mt-5">
                        <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                    </div>
                </Wrapper>
            </div>
        );
    }

    if (!availableNetworks.includes(String(chainId))) {
        return (
            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-2xl rounded text-center">
                <Wrapper id="swap-page">
                    <div className="inline-block">
                        This chain is not currently supported for bridging to BOMBChain.
                    </div>
                </Wrapper>
            </div>
        );
    }

    if (!availableNetworks || availableNetworks.length <= 0 || !depositAddress) {
        return (
            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-2xl rounded text-center">
                <Wrapper id="swap-page">
                    <div className="inline-block">
                        <Loader />
                    </div>
                </Wrapper>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Bridge`)} | BOMB</title>
                <meta
                    name="description"
                    content="BOMBSwap allows for bridging of ERC20 compatible tokens to BOMBChain"
                />
            </Helmet>

            <div className="mb-10 text-lg">
                Bridge assets to BOMBChain
            </div>

            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-2xl rounded">
                <Wrapper id="swap-page">
                    <AutoColumn gap={'md'}>
                        <CurrencyInputPanel
                            label={i18n._(t`Bridge:`)}
                            value={formattedAmounts[Field.INPUT]}
                            showMaxButton={!atMaxAmountInput}
                            currency={currencies[Field.INPUT]}
                            onUserInput={handleTypeInput}
                            onMax={handleMaxInput}
                            onCurrencySelect={handleInputSelect}
                            onlySpecificTokens={availableTokens}
                            id="swap-currency-input"
                        />
                    </AutoColumn>
                    <BottomGrouping>
                        {!account ? (
                            <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                        ) : !currencies[Field.INPUT] || !formattedAmounts[Field.INPUT] || Number(formattedAmounts[Field.INPUT]) <= 0 ? (
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
                                    // onClick={approveCallback}
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
                                    onClick={() => {alert('Not implemented');}}
                                    width="48%"
                                    id="swap-button"
                                    disabled={!isValid || approval !== ApprovalState.APPROVED}
                                >
                                    <Text fontSize={16} fontWeight={500}>
                                        {i18n._(t`Swap`)}
                                    </Text>
                                </ButtonError>
                            </RowBetween>
                        ) : (
                            <ButtonPrimary onClick={() => {handleBridge()}}>
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

            <div className="mt-10 text-lg text-center">
                <div>
                Alternatively, you can simply send your tokens to the following address:
                </div>
                <div>{depositAddress}</div>
                <div
                    className="mt-10 mx-auto"
                    style={{
                        height: "auto",
                        maxWidth: 150, width:
                            "100%", background:
                            "white", padding: "8px"
                    }}
                >
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={depositAddress}
                        viewBox={"0 0 256 256"}
                    />
                </div>
            </div>

            <div className="mt-10 text-lg text-center">
                <a href="https://chainscanner.xyz/ankr/appchains/bridge/?network=bomb-mainnet">Looking to bridge BOMB, USDC, or USDT, go here!</a>
            </div>
        </>
    )
}
