import { ChainId, Currency, JSBI, Price, WETH, currencyEquals } from '@peghub/sdk'
import { useMemo } from 'react'
import { USDC, BSC } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { wrappedCurrency } from '../utils/wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
    const { chainId } = useActiveWeb3React()
    const wrapped = wrappedCurrency(currency, chainId)
    const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
        () => [
            [
                chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
                chainId ? WETH[chainId] : undefined
            ],
            [wrapped?.equals(BSC.USD) ? undefined : wrapped, chainId === ChainId.BSC ? BSC.USD : undefined],
            [chainId ? WETH[chainId] : undefined, chainId === ChainId.BSC ? BSC.USD : undefined],
            [chainId ? BSC.BTCB : undefined, chainId === ChainId.BSC ? BSC.USD : undefined]
        ],
        [chainId, currency, wrapped]
    )
    const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair], [btcbPairState, btcbPair]] = usePairs(tokenPairs)

    return useMemo(() => {
        if (!currency || !wrapped || !chainId) {
            return undefined
        }
        // handle weth/eth
        if (wrapped.equals(WETH[chainId])) {
            if (usdcPair) {
                const price = usdcPair.priceOf(WETH[chainId])
                return new Price(currency, BSC.USD, price.denominator, price.numerator)
            } else {
                return undefined
            }
        }
        if (wrapped.equals(BSC.BTCB)) {
            if (usdcPair) {
                const price = usdcPair.priceOf(BSC.BTCB)
                return new Price(currency, BSC.USD, price.denominator, price.numerator)
            } else {
                return undefined
            }
        }


        // handle usdc
        if (wrapped.equals(BSC.USD)) {
            return new Price(BSC.USD, BSC.USD, '1', '1')
        }

        const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
        const ethPairETHUSDCValue: JSBI =
            ethPairETHAmount && usdcEthPair
                ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw
                : JSBI.BigInt(0)

        // const btcbPairETHAmount = btcbPair?.reserveOf(BSC.BTCB)
        // const btcbPairETHUSDCValue: JSBI =
        //     btcbPairETHAmount && usdcEthPair
        //         ? usdcEthPair.priceOf(BSC.BTCB).quote(btcbPairETHAmount).raw
        //         : JSBI.BigInt(0)


        // all other tokens
        // first try the usdc pair
        if (
            usdcPairState === PairState.EXISTS &&
            usdcPair &&
            usdcPair.reserveOf(BSC.USD).greaterThan(ethPairETHUSDCValue)
        ) {
            const price = usdcPair.priceOf(wrapped)
            return new Price(currency, BSC.USD, price.denominator, price.numerator)
        }
        if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
            if (usdcEthPair.reserveOf(BSC.USD).greaterThan('0') && ethPair.reserveOf(WETH[chainId]).greaterThan('0')) {
                const ethUsdcPrice = usdcEthPair.priceOf(BSC.USD)
                const currencyEthPrice = ethPair.priceOf(WETH[chainId])
                const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
                return new Price(currency, BSC.USD, usdcPrice.denominator, usdcPrice.numerator)
            }
        }

        return undefined
    }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}
