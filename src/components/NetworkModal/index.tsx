import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@bombswap/sdk'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'

const PARAMS: {
    [chainId in ChainId]?: {
        chainId: string
        chainName: string
        nativeCurrency: {
            name: string
            symbol: string
            decimals: number
        }
        rpcUrls: string[]
        blockExplorerUrls: string[]
    }
} = {
    [ChainId.MAINNET]: {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3'],
        blockExplorerUrls: ['https://etherscan.com']
    },
    [ChainId.FANTOM]: {
        chainId: '0xfa',
        chainName: 'Fantom',
        nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: 18
        },
        rpcUrls: ['https://rpcapi.fantom.network'],
        blockExplorerUrls: ['https://ftmscan.com']
    },
    [ChainId.BSC]: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com']
    },
    [ChainId.MATIC]: {
        chainId: '0x89',
        chainName: 'Matic',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [
            //'https://matic-mainnet.chainstacklabs.com/'
            'https://polygon-rpc.com'
        ],
        blockExplorerUrls: ['https://polygonscan.com']
    },
    [ChainId.HECO]: {
        chainId: '0x80',
        chainName: 'Heco',
        nativeCurrency: {
            name: 'Heco Token',
            symbol: 'HT',
            decimals: 18
        },
        rpcUrls: ['https://http-mainnet.hecochain.com'],
        blockExplorerUrls: ['https://hecoinfo.com']
    },
    [ChainId.XDAI]: {
        chainId: '0x64',
        chainName: 'xDai',
        nativeCurrency: {
            name: 'xDai Token',
            symbol: 'xDai',
            decimals: 18
        },
        rpcUrls: ['https://rpc.xdaichain.com'],
        blockExplorerUrls: ['https://blockscout.com/poa/xdai']
    },
    [ChainId.HARMONY]: {
        chainId: '0x63564C40',
        chainName: 'Harmony One',
        nativeCurrency: {
            name: 'One Token',
            symbol: 'ONE',
            decimals: 18
        },
        rpcUrls: ['https://api.s0.t.hmny.io'],
        blockExplorerUrls: ['https://explorer.harmony.one/']
    },
    [ChainId.AVALANCHE]: {
        chainId: '0xA86A',
        chainName: 'Avalanche',
        nativeCurrency: {
            name: 'Avalanche Token',
            symbol: 'AVAX',
            decimals: 18
        },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://explorer.avax.network']
    },
    [ChainId.OKEX]: {
        chainId: '0x42',
        chainName: 'OKEx',
        nativeCurrency: {
            name: 'OKEx Token',
            symbol: 'OKT',
            decimals: 18
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain']
    },
    [ChainId.BOMB]: {
        chainId: '0x8FC',
        chainName: 'BOMB Chain',
        nativeCurrency: {
            name: 'BOMB',
            symbol: 'BOMB',
            decimals: 18
        },
        rpcUrls: ['https://rpc.bombchain.com'],
        blockExplorerUrls: ['https://bombscan.com']
    },
    [ChainId.BOMB_TESTNET]: {
        chainId: '0x95F',
        chainName: 'BOMB Testnet',
        nativeCurrency: {
            name: 'BOMB Token',
            symbol: 'BOMB',
            decimals: 18
        },
        rpcUrls: ['https://bombchain-testnet.ankr.com/bas_full_rpc_1'],
        blockExplorerUrls: ['https://explorer.bombchain-testnet.ankr.com/']
    }
}

export default function NetworkModal(): JSX.Element | null {
    const { chainId, library, account } = useActiveWeb3React()
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()

    if (!chainId) return null

    return (
        <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
            <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />
            <div className="mb-6 text-lg text-primary">
                You are currently using <span className="font-bold text-pink">BOMB Swap</span>
                <br /> on the <span className="font-bold text-blue">{NETWORK_LABEL[chainId]}</span> network
            </div>

            <div className="flex flex-col space-y-5 overflow-y-auto">
                {[
                    // ChainId.MAINNET,
                    // ChainId.FANTOM,
                    // ChainId.BOMB,
                    ChainId.BSC,

                    // ChainId.HECO,
                    // ChainId.XDAI,
                    // ChainId.HARMONY,
                    ChainId.AVALANCHE,
                    ChainId.MATIC
                    // ChainId.BOMB_TESTNET
                    // ChainId.OKEX
                ].map((key: ChainId, i: number) => {
                    if (chainId === key) {
                        return (
                            <button key={i} className="w-full p-px rounded bg-dark-800">
                                <div className="flex items-center w-full h-full p-3 rounded bg-dark-800">
                                    <img
                                        src={NETWORK_ICON[key]}
                                        alt="Switch Network"
                                        className="w-8 h-8 mr-3 rounded-md"
                                    />
                                    <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                                </div>
                            </button>
                        )
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                toggleNetworkModal()
                                const params = PARAMS[key]
                                library?.send('wallet_addEthereumChain', [params, account])
                            }}
                            className="flex items-center w-full p-3 rounded cursor-pointer bg-dark-1000 hover:bg-dark-700"
                        >
                            <img src={NETWORK_ICON[key]} alt="Switch Network" className="w-8 h-8 mr-2 rounded-md" />
                            <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                        </button>
                    )
                })}
            </div>
        </Modal>
    )
}
