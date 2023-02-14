import { ChainId, Currency } from '@bombswap/sdk'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Logo from '../assets/images/bombswap.png'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useETHBalances } from '../state/wallet/hooks'
import { ReactComponent as Burger } from '../assets/images/burger.svg'
import { ReactComponent as X } from '../assets/images/x.svg'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import Web3Faucet from './Web3Faucet'
import MoreMenu from './Menu'
import { ExternalLink, NavLink } from './Link'
import { Disclosure } from '@headlessui/react'
import { ANALYTICS_URL } from '../constants'
import QuestionHelper from './QuestionHelper'
import { t } from '@lingui/macro'
import LanguageSwitch from './LanguageSwitch'
import { useLingui } from '@lingui/react'

function AppBar(): JSX.Element {
    const { i18n } = useLingui()
    const { account, chainId, library } = useActiveWeb3React()
    const { pathname } = useLocation()

    const [navClassList, setNavClassList] = useState('w-screen bg-transparent z-10')

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    useEffect(() => {
        if (pathname === '/trade') {
            setNavClassList('w-screen bg-transparent z-10')
        } else {
            setNavClassList('w-screen bg-transparent z-10')
        }
    }, [pathname])

    const [bombswapUsdPrice, setBombswapUsdPrice] = useState('')
    useEffect(() => {
        if (!account) {
            return
        }
        fetch('https://api.bomb.farm/prices')
            .then(res => res.json())
            .then(data => {
                setBombswapUsdPrice(data.BOMBSWAP.toFixed(2))
            })
    }, [account])

    return (
        <header className="flex flex-row justify-between w-screen flex-nowrap">
            <Disclosure as="nav" className={navClassList}>
                {({ open }) => (
                    <>
                        <div className="mainnav px-4 py-1.5 bg-black">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img src={Logo} alt="BOMB" className="w-auto h-10" />
                                    </div>
                                    <div className="hidden sm:block sm:ml-4">
                                        <div className="flex space-x-2">
                                            <NavLink id={`swap-nav-link`} to={'/'}>
                                                {i18n._(t`Home`)}
                                            </NavLink>
                                            {chainId && ![ChainId.BOMB].includes(chainId) && (
                                                <div
                                                    className={'navDropdownMenu'}
                                                    style={{ display: 'inline', position: 'relative' }}
                                                >
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid  */}
                                                    <a
                                                        className={
                                                            'navDropdownMenuRoot navLink text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis p-2 md:p-3 whitespace-nowrap'
                                                        }
                                                        href={undefined}
                                                    >
                                                        Protocols
                                                    </a>
                                                    <div className={'navDropdownMenuContainer'}>
                                                        <ul className={'navDropdownMenuWrapper'}>
                                                            <li className={'navDropdownMenuItem'}>
                                                                <a
                                                                    id={`swap-nav-link`}
                                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                                    href={'https://app.bomb.money/'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {i18n._(t`BOMB.money`)}
                                                                </a>
                                                            </li>
                                                            <li className={'navDropdownMenuItem'}>
                                                                <a
                                                                    id={`swap-nav-link`}
                                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                                    href={'https://app.bitbomb.io/'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {i18n._(t`bitBOMB`)}
                                                                </a>
                                                            </li>
                                                            <li className={'navDropdownMenuItem'}>
                                                                <a
                                                                    id={`swap-nav-link`}
                                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                                    href={'https://www.czpegs.com/'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {i18n._(t`czPegs`)}
                                                                </a>
                                                            </li>
                                                            <li className={'navDropdownMenuItem'}>
                                                                <a
                                                                    id={`swap-nav-link`}
                                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                                    href={'https://www.snowpegs.com/'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {i18n._(t`SnowPegs`)}
                                                                </a>
                                                            </li>
                                                            <li className={'navDropdownMenuItem'}>
                                                                <a
                                                                    id={`swap-nav-link`}
                                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                                    href={'https://www.polypegs.com/'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {i18n._(t`PolyPegs`)}
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {/* <NavLink id={`swap-nav-link`} to={'/swap'}>
                                                {i18n._(t`Swap`)}
                                            </NavLink> */}
                                            {chainId && [ChainId.MATIC].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://vaults.peghub.com/#/polygon'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Vaults`)}
                                                </a>
                                            )}
                                            {chainId && [ChainId.BOMB].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://vaults.peghub.com/#/bomb'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Vaults`)}
                                                </a>
                                            )}
                                            {chainId && [ChainId.AVALANCHE].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://vaults.peghub.com/#/avax'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Vaults`)}
                                                </a>
                                            )}
                                            {chainId && [ChainId.BSC].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://vaults.peghub.com/#/bsc'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Vaults`)}
                                                </a>
                                            )}
                                            {chainId &&
                                                chainId !== ChainId.BSC &&
                                                chainId !== ChainId.MATIC &&
                                                chainId !== ChainId.BOMB &&
                                                chainId !== ChainId.AVALANCHE && (
                                                    <a
                                                        id={`swap-nav-link`}
                                                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                        href={'https://vaults.peghub.com/'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {i18n._(t`Vaults`)}
                                                    </a>
                                                )}
                                            {chainId && chainId !== ChainId.BOMB && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://docs.peghub.com/'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Docs`)}
                                                </a>
                                            )}
                                            {chainId && [ChainId.BOMB].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://docs.bombswap.xyz/'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Docs`)}
                                                </a>
                                            )}
                                            {/* {chainId && [ChainId.BOMB].includes(chainId) && (
                                                <a
                                                    id={`swap-nav-link`}
                                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    href={'https://info.bombswap.xyz'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {i18n._(t`Stats`)}
                                                </a>
                                            )} */}
                                            {chainId && chainId === ChainId.BOMB && (
                                                <NavLink id={`yield-nav-link`} to={'/stake'}>
                                                    {i18n._(t`xBOMBSWAP`)}
                                                </NavLink>
                                            )}
                                            {chainId && chainId === ChainId.BOMB && (
                                                <NavLink id={`swap-nav-link`} to={'/bridge'}>
                                                    {i18n._(t`Bridge to BSC`)}
                                                </NavLink>
                                            )}
                                            {chainId && chainId === ChainId.BSC && (
                                                <NavLink id={`swap-nav-link`} to={'/bridge'}>
                                                    {i18n._(t`Bridge to BOMBCHAIN`)}
                                                </NavLink>
                                            )}
                                            {/*   {chainId === ChainId.BOMB && (
                                                <NavLink id={`sushibar-nav-link`} to={'/sushibar'}>
                                                    {i18n._(t`SushiBar`)}
                                                </NavLink>
                                            )} */}
                                            {/* {chainId &&
                                                [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(
                                                    chainId
                                                ) && (
                                                    <NavLink id={`kashi-nav-link`} to={'/bento/kashi/lend'}>
                                                        {i18n._(t`Lend`)}
                                                    </NavLink>
                                                )} */}

                                            {/* BENTOBOX */}

                                            {/* {chainId &&
                                                [ChainId.BOMB, ChainId.BOMB_TESTNET].includes(
                                                    chainId
                                                ) && (
                                                    <NavLink id={`bento-nav-link`} to={'/bento'}>
                                                        {i18n._(t`BentoBox`)}
                                                    </NavLink>
                                                )} */}

                                            {/* {chainId === ChainId.MAINNET && (
                                                <NavLink id={`vesting-nav-link`} to={'/vesting'}>
                                                    {i18n._(t`Vesting`)}
                                                </NavLink>
                                            )} */}
                                            {chainId && [ChainId.BOMB].includes(chainId) && (
                                                <ExternalLink
                                                    id={`analytics-nav-link`}
                                                    href={ANALYTICS_URL[chainId] || 'https://info.bombswap.xyz'}
                                                >
                                                    {i18n._(t`Analytics`)}
                                                </ExternalLink>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="fixed bottom-0 left-0 flex flex-row items-center justify-center w-full p-4 lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                                    <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                                        {chainId &&
                                            [ChainId.BOMB].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper
                                                        text={i18n._(t`Add BOMBSWAP to your Metamask wallet`)}
                                                    >
                                                        <div
                                                            className="hidden rounded-md cursor-pointer sm:inline-block bg-dark-900 hover:bg-dark-800"
                                                            onClick={() => {
                                                                let address: string | undefined
                                                                switch (chainId) {
                                                                    case ChainId.BOMB:
                                                                        address =
                                                                            '0xaC029BF2871b3f810AAbF836Adc4F89369027971'
                                                                        break
                                                                }
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address: address,
                                                                        symbol: 'BOMBSWAP',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bombswap.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added BOMBSWAP to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/bombswap.jpeg`}
                                                                alt="Switch Network"
                                                                style={{
                                                                    minWidth: 36,
                                                                    minHeight: 36,
                                                                    maxWidth: 36,
                                                                    maxHeight: 36
                                                                }}
                                                                className="object-contain rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                    <span className="mt-1 ml-3 font-bold text-primary">
                                                        ${bombswapUsdPrice}
                                                    </span>
                                                </>
                                            )}

                                        {chainId &&
                                            [ChainId.BSC].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper text={i18n._(t`Add BOMB to your Metamask wallet`)}>
                                                        <div
                                                            className="hidden rounded-md cursor-pointer sm:inline-block bg-dark-900 hover:bg-dark-800"
                                                            onClick={() => {
                                                                let address: string | undefined
                                                                switch (chainId) {
                                                                    case ChainId.BSC:
                                                                        address =
                                                                            '0x522348779DCb2911539e76A1042aA922F9C47Ee3'
                                                                        break
                                                                }
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address: address,
                                                                        symbol: 'BOMB',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://www.bombswap.xyz/images/tokens/0x522348779DCb2911539e76A1042aA922F9C47Ee3.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added BOMB to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/square-bomb.png`}
                                                                alt="Switch Network"
                                                                style={{
                                                                    minWidth: 36,
                                                                    minHeight: 36,
                                                                    maxWidth: 36,
                                                                    maxHeight: 36
                                                                }}
                                                                className="object-contain rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                </>
                                            )}

                                        {/* {chainId &&
                                            [ChainId.BSC].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper
                                                        text={i18n._(t`Add BOMB to your Metamask wallet`)}
                                                    >
                                                        <div
                                                            className="hidden rounded-md cursor-pointer sm:inline-block bg-dark-900 hover:bg-dark-800"
                                                            onClick={() => {
                                                                let address: string | undefined
                                                                switch (chainId) {
                                                                    case ChainId.BSC:
                                                                        address =
                                                                            '0x522348779DCb2911539e76A1042aA922F9C47Ee3'
                                                                        break
                                                                }
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address: address,
                                                                        symbol: 'BOMB',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://www.bombswap.xyz/images/tokens/0x522348779DCb2911539e76A1042aA922F9C47Ee3.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added BOMB to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/square-bomb.png`}
                                                                alt="Switch Network"
                                                                style={{
                                                                    minWidth: 36,
                                                                    minHeight: 36,
                                                                    maxWidth: 36,
                                                                    maxHeight: 36
                                                                }}
                                                                className="object-contain rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                </>
                                            )} */}
                                        {chainId &&
                                            [ChainId.BSC].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper
                                                        text={i18n._(t`Add PegHub to your Metamask wallet`)}
                                                    >
                                                        <div
                                                            className="hidden rounded-md cursor-pointer sm:inline-block bg-dark-900 hover:bg-dark-800"
                                                            onClick={() => {
                                                                let address: string | undefined
                                                                switch (chainId) {
                                                                    case ChainId.BSC:
                                                                        address =
                                                                            '0x95A6772a2272b9822D4b3DfeEaedF732F1D28DB8'
                                                                        break
                                                                }
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address: address,
                                                                        symbol: 'PHUB',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://www.bombswap.xyz/images/tokens/0x95A6772a2272b9822D4b3DfeEaedF732F1D28DB8.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added PHUB to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/square-logo.png`}
                                                                alt="Switch Network"
                                                                style={{
                                                                    minWidth: 36,
                                                                    minHeight: 36,
                                                                    maxWidth: 36,
                                                                    maxHeight: 36
                                                                }}
                                                                className="object-contain rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                </>
                                            )}
                                        {/* {account && chainId && (
                                            <div className="hidden sm:inline-block">
                                                <a
                                                    className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
                                                    href="https://app.multichain.org/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <div className="grid items-center grid-flow-col px-3 py-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
                                                        <div className="text-primary">{i18n._(t`Bridge`)}</div>
                                                    </div>
                                                </a>
                                            </div>
                                        )} */}
                                        {library && library.provider.isMetaMask && (
                                            <div className="hidden sm:inline-block">
                                                <Web3Network />
                                            </div>
                                        )}

                                        <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                                            {account && chainId && userEthBalance && (
                                                <>
                                                    <div className="px-3 py-2 text-primary text-bold">
                                                        {userEthBalance?.toSignificant(4)}{' '}
                                                        {Currency.getNativeCurrencySymbol(chainId)}
                                                    </div>
                                                </>
                                            )}
                                            <Web3Status />
                                        </div>
                                        <LanguageSwitch />

                                        {chainId &&
                                            [
                                                ChainId.GÖRLI,
                                                ChainId.KOVAN,
                                                ChainId.RINKEBY,
                                                ChainId.ROPSTEN,
                                                ChainId.BOMB_TESTNET
                                            ].includes(chainId) && <Web3Faucet />}

                                        {/*<MoreMenu />*/}
                                    </div>
                                </div>
                                <div className="flex -mr-2 sm:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                                        <span className="sr-only">{i18n._(t`Open main menu`)}</span>
                                        {open ? (
                                            <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                                        ) : (
                                            <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                        <div className="subnav">
                            <NavLink id={`swap-nav-link`} to={'/swap'}>
                                {i18n._(t`Swap`)}
                            </NavLink>
                            <NavLink
                                id={`pool-nav-link`}
                                to={'/pool'}
                                isActive={(match, { pathname }) =>
                                    Boolean(match) ||
                                    pathname.startsWith('/add') ||
                                    pathname.startsWith('/remove') ||
                                    pathname.startsWith('/create') ||
                                    pathname.startsWith('/find')
                                }
                            >
                                {i18n._(t`Pool`)}
                            </NavLink>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                {/* <a
                                href="#"
                                className="block px-3 py-2 text-base font-medium text-white rounded-md bg-gray-1000"
                            >
                                Dashboard
                            </a> */}

                                <NavLink id={`swap-nav-link`} to={'/'}>
                                    {i18n._(t`Home`)}
                                </NavLink>
                                <NavLink id={`swap-nav-link`} to={'/stake'}>
                                    {i18n._(t`Stake`)}
                                </NavLink>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://app.bomb.money/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`BOMB.money`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://app.bitbomb.io/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`bitBOMB`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://www.czpegs.com/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`czPegs`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://www.snowpegs.com/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`SnowPegs`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://www.polypegs.com/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`PolyPegs`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://vaults.peghub.com/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`Vaults`)}
                                </a>
                                <a
                                    id={`swap-nav-link`}
                                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    href={'https://docs.peghub.com/'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {i18n._(t`Docs`)}
                                </a>

                                {/*<NavLink id={`swap-nav-link`} to={'/swap'}>*/}
                                {/*    {i18n._(t`Swap`)}*/}
                                {/*</NavLink>*/}
                                {/*<NavLink*/}
                                {/*    id={`pool-nav-link`}*/}
                                {/*    to={'/pool'}*/}
                                {/*    isActive={(match, { pathname }) =>*/}
                                {/*        Boolean(match) ||*/}
                                {/*        pathname.startsWith('/add') ||*/}
                                {/*        pathname.startsWith('/remove') ||*/}
                                {/*        pathname.startsWith('/create') ||*/}
                                {/*        pathname.startsWith('/find')*/}
                                {/*    }*/}
                                {/*>*/}
                                {/*    {i18n._(t`Pool`)}*/}
                                {/*</NavLink>*/}

                                {/*{chainId && [ChainId.MAINNET, ChainId.MATIC].includes(chainId) && (*/}
                                {/*    <NavLink id={`yield-nav-link`} to={'/yield'}>*/}
                                {/*        {i18n._(t`Yield`)}*/}
                                {/*    </NavLink>*/}
                                {/*)}*/}
                                {/*{chainId &&*/}
                                {/*    [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(chainId) && (*/}
                                {/*        <NavLink id={`kashi-nav-link`} to={'/bento/kashi/lend'}>*/}
                                {/*            {i18n._(t`Kashi Lending`)}*/}
                                {/*        </NavLink>*/}
                                {/*    )}*/}
                                {/*{chainId &&*/}
                                {/*    [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(chainId) && (*/}
                                {/*        <NavLink id={`bento-nav-link`} to={'/bento'}>*/}
                                {/*            {i18n._(t`BentoBox`)}*/}
                                {/*        </NavLink>*/}
                                {/*    )}*/}
                                {/*{chainId === ChainId.MAINNET && (*/}
                                {/*    <NavLink id={`stake-nav-link`} to={'/sushibar'}>*/}
                                {/*        {i18n._(t`SushiBar`)}*/}
                                {/*    </NavLink>*/}
                                {/*)}*/}
                                {/*{chainId === ChainId.MAINNET && (*/}
                                {/*    <NavLink id={`vesting-nav-link`} to={'/vesting'}>*/}
                                {/*        {i18n._(t`Vesting`)}*/}
                                {/*    </NavLink>*/}
                                {/*)}*/}
                                {/*{chainId &&*/}
                                {/*    [*/}
                                {/*        ChainId.MAINNET,*/}
                                {/*        ChainId.BSC,*/}
                                {/*        ChainId.XDAI,*/}
                                {/*        ChainId.FANTOM,*/}
                                {/*        ChainId.MATIC*/}
                                {/*    ].includes(chainId) && (*/}
                                {/*        <ExternalLink*/}
                                {/*            id={`analytics-nav-link`}*/}
                                {/*            href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}*/}
                                {/*        >*/}
                                {/*            {i18n._(t`Analytics`)}*/}
                                {/*        </ExternalLink>*/}
                                {/*    )}*/}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </header>
    )
}

export default AppBar
