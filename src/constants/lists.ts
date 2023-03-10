// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = []

//const SUSHI_LIST = 'https://token-list.sushi.com'
const PANCAKE_LIST = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const QUICKSWAP_LIST = 'https://unpkg.com/quickswap-default-token-list@1.2.52/build/quickswap-default.tokenlist.json'
// const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
// const UMA_LIST = 'https://umaproject.org/uma.tokenlist.json'
// const NFTX_LIST = 'https://nftx.ethereumdb.com/v1/tokenlist/'
// const AAVE_LIST = 'tokenlist.aave.eth'
// const SYNTHETIX_LIST = 'synths.snx.eth'
// const WRAPPED_LIST = 'wrapped.tokensoft.eth'
// const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
// const OPYN_LIST = 'https://raw.githubusercontent.com/opynfinance/opyn-tokenlist/master/opyn-v1.tokenlist.json'
// const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
// const COINGECKO_LIST = 'https://tokens.pancakeswap.finance/coingecko.json'
//const CMC_ALL_LIST = 'https://tokens.pancakeswap.finance/cmc.json'
// const CMC_STABLECOIN = 'stablecoin.cmc.eth'
// const KLEROS_LIST = 't2crtokens.eth'
// const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
// const QUICK_SWAP = 'https://unpkg.com/quickswap-default-token-list@1.0.39/build/quickswap-default.tokenlist.json'

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
    PANCAKE_LIST,
    QUICKSWAP_LIST,
    ...UNSUPPORTED_LIST_URLS // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
