import { FC } from 'react'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import useCollections from 'hooks/useCollections'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { formatNumber } from 'lib/numbers'
import { useRouter } from 'next/router'
import { PercentageChange } from './hero/HeroStats'
import { useMediaQuery } from '@react-hookz/web'
import { CollectionSets, recoilSelectedYear } from './YearDropdown'
import { useRecoilValue } from 'recoil'

type Props = {
  fallback: {
    collections: paths['/collections/v4']['get']['responses']['200']['schema']
  }
}

const YearlyCollectionsSetMapping: Record<CollectionSets, string> = {
  '2016 Ethereum':
    '284d1a1f8985b0af107c6c78cbcb7fd53d7bada6a4f4fe52c1010404502a33e4',
  '2017 Ethereum':
    '7a0c0e19231ee53992967862acfea34ae6fcdf56ab2597fe8c8d9f46cc320bd5',
  '2018 Ethereum':
    '73fdf58fc6d8032c095b8f9213ab744ed795d18b7bc70402108174a37ee44049',
  '2019 Ethereum':
    '973b7d4f9610024e5146c7c252ac2a69f2072ddb2aa2c421700f7c030326265d',
  'Trending Collections':
    '5f9b0249c6e630d0e9f5ab1f9fd6351721f02ab2db1385a5b4d43479ba3a51ab',
}

const YearlyCollectionTable: FC<Props> = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  const yearSelected = useRecoilValue(recoilSelectedYear)
  const { collections, ref } = useCollections(
    router,
    undefined,
    YearlyCollectionsSetMapping[yearSelected]
  )

  const { data } = collections

  const sort = router?.query['sort']?.toString()

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedCollections = data
    ? data.flatMap(({ collections }) => collections)
    : []

  const columns = isSmallDevice
    ? ['Collection', 'Floor Price']
    : ['Collection', 'Volume', 'Floor Price', 'Supply']

  return (
    <div className="mb-11 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((item) => (
              <th
                key={item}
                scope="col"
                className="reservoir-subtitle px-6 py-3 text-left dark:text-white"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappedCollections?.map((collection, index, arr) => {
            const {
              contract,
              tokenHref,
              image,
              name,
              days1,
              days30,
              days7,
              days1Change,
              days7Change,
              days30Change,
              floorSaleChange1Days,
              floorSaleChange7Days,
              floorSaleChange30Days,
              floorPrice,
              supply,
            } = processCollection(collection)

            return (
              <tr
                key={`${contract}-${index}`}
                ref={index === arr.length - 5 ? ref : null}
                className="group h-[88px] border-b border-neutral-300 dark:border-neutral-600 dark:text-white"
              >
                {/* COLLECTION */}
                <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                  <div className="reservoir-h6 mr-6 dark:text-white">
                    {index + 1}
                  </div>
                  <Link href={tokenHref}>
                    <a className="flex items-center gap-2">
                      <img
                        src={optimizeImage(image, 140)}
                        className="h-[56px] w-[56px] rounded-full object-cover"
                      />
                      <div
                        className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap dark:text-white ${
                          isSmallDevice ? 'max-w-[140px]' : ''
                        }`}
                      >
                        {name}
                      </div>
                    </a>
                  </Link>
                </td>

                {/* VOLUME */}
                {!isSmallDevice && (
                  <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                    <FormatEth
                      amount={
                        sort === '7DayVolume'
                          ? days7
                          : sort === '30DayVolume'
                          ? days30
                          : days1
                      }
                    />
                    <PercentageChange
                      value={
                        sort === '7DayVolume'
                          ? days7Change
                          : sort === '30DayVolume'
                          ? days30Change
                          : days1Change
                      }
                    />
                  </td>
                )}

                {/* FLOOR PRICE */}
                <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                  <FormatEth amount={floorPrice} />
                  <PercentageChange
                    value={
                      sort === '7DayVolume'
                        ? floorSaleChange7Days
                        : sort === '30DayVolume'
                        ? floorSaleChange30Days
                        : floorSaleChange1Days
                    }
                  />
                </td>

                {/* SUPPLY */}
                {!isSmallDevice && (
                  <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                    {supply ? formatNumber(+supply) : '-'}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default YearlyCollectionTable

function getFloorDelta(
  currentFloor: number | undefined,
  previousFloor: number | undefined
) {
  if (!currentFloor || !previousFloor) return 0

  return (currentFloor - previousFloor) / previousFloor
}

function processCollection(
  collection:
    | NonNullable<
        NonNullable<Props['fallback']['collections']>['collections']
      >[0]
    | undefined
) {
  const data = {
    contract: collection?.primaryContract,
    id: collection?.id,
    image: collection?.image,
    name: collection?.name,
    days1: collection?.volume?.['1day'],
    days7: collection?.volume?.['7day'],
    days30: collection?.volume?.['30day'],
    days1Change: collection?.volumeChange?.['1day'],
    days7Change: collection?.volumeChange?.['7day'],
    days30Change: collection?.volumeChange?.['30day'],
    floor1Days: collection?.floorSale?.['1day'],
    floor7Days: collection?.floorSale?.['7day'],
    floor30Days: collection?.floorSale?.['30day'],
    floorSaleChange1Days: collection?.floorSaleChange?.['1day'],
    floorSaleChange7Days: collection?.floorSaleChange?.['7day'],
    floorSaleChange30Days: collection?.floorSaleChange?.['30day'],
    floorPrice: collection?.floorAskPrice,
    supply: collection?.tokenCount,
  }

  const tokenHref = `/collections/${data.id}`

  return { ...data, tokenHref }
}
