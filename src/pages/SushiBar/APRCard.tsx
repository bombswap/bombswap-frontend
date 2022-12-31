import React, { useEffect, useState } from 'react'
//import sushiData from '@sushiswap/sushi-data'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function APRCard() {
    const { i18n } = useLingui()
    // const [Apr, setApr] = useState<any>()
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const results = await Promise.all([
    //             sushiData.bar.info(),
    //             sushiData.exchange.dayData(),
    //             sushiData.sushi.priceUSD()
    //         ])
    //         const APR =
    //             (((results[1][1].volumeUSD * 0.05) / results[0].totalSupply) * 365) / (results[0].ratio * results[2])

    //         setApr(APR)
    //     }
    //     fetchData()
    // }, [])
    return (
        <></>
        // <div className="flex items-center justify-between w-full h-24 max-w-xl p-4 rounded md:pl-5 md:pr-7 bg-light-yellow bg-opacity-40">
        //     <div className="flex flex-col">
        //         <div className="flex items-center justify-center mb-4 flex-nowrap md:mb-2">
        //             <p className="font-bold whitespace-nowrap text-caption2 md:text-lg md:leading-5 text-high-emphesis">
        //                 {i18n._(t`Staking APR`)}{' '}
        //             </p>
        //             {/* <img className="ml-3 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} /> */}
        //         </div>
        //         <div className="flex">
        //             <a
        //                 href={`https://analytics.sushi.com/bar`}
        //                 target="_blank"
        //                 rel="noreferrer noopener"
        //                 className={`
        //                 py-1 px-4 md:py-1.5 md:px-7 rounded
        //                 text-xs md:text-sm font-medium md:font-bold text-dark-900
        //                 bg-light-yellow hover:bg-opacity-90`}
        //             >
        //                 {i18n._(t`View Stats`)}
        //             </a>
        //         </div>
        //     </div>
        //     <div className="flex flex-col">
        //         <p className="mb-1 text-lg font-bold text-right text-high-emphesis md:text-h4">
        //             {/* {`${Apr ? Apr.toFixed(2) + '%' : i18n._(t`Loading...`)}`} */}
        //         </p>
        //         <p className="w-32 text-right text-primary md:w-64 text-caption2 md:text-base">
        //             {i18n._(t`Yesterday's APR`)}
        //         </p>
        //     </div>
        // </div>
    )
}
