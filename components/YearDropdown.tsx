import { FC, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FiChevronDown } from 'react-icons/fi'
import { atom, SetterOrUpdater, useRecoilState } from 'recoil'

export type CollectionSets =
  | '2016 Ethereum'
  | '2017 Ethereum'
  | '2018 Ethereum'
  | '2019 Ethereum'
  | 'Trending Collections'

export const recoilSelectedYear = atom<CollectionSets>({
  key: 'activeYear',
  default: 'Trending Collections',
})

const YearDropdown: FC = () => {
  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useRecoilState(recoilSelectedYear)

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger className="reservoir-h6 rounded dark:text-white dark:outline-none dark:ring-primary-900 dark:focus:ring-4">
        {selectedYear ?? 'Select Year'}
        <FiChevronDown
          className={`ml-3 inline text-[#525252] transition-transform dark:text-[#D4D4D4] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={43}
        className="max-h-[300px] max-w-[300px] overflow-scroll rounded-2xl bg-white shadow-md radix-side-bottom:animate-slide-down dark:bg-neutral-900 md:max-w-[422px]"
      >
        <YearItem
          label={'Trending Collections'}
          setOpen={setOpen}
          setSelectedYear={setSelectedYear}
        />
        <YearItem
          label={'2016 Ethereum'}
          setOpen={setOpen}
          setSelectedYear={setSelectedYear}
        />
        <YearItem
          label={'2017 Ethereum'}
          setOpen={setOpen}
          setSelectedYear={setSelectedYear}
        />
        <YearItem
          label={'2018 Ethereum'}
          setOpen={setOpen}
          setSelectedYear={setSelectedYear}
        />
        <YearItem
          label={'2019 Ethereum'}
          setOpen={setOpen}
          setSelectedYear={setSelectedYear}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const YearItem: FC<{
  setOpen: (v: boolean) => void
  label: CollectionSets
  setSelectedYear: SetterOrUpdater<CollectionSets>
}> = ({ setOpen, label, setSelectedYear }) => {
  return (
    <DropdownMenu.Item
      key={label}
      className="reservoir-gray-dropdown-item overflow-hidden rounded-none border-b p-0 outline-none first:rounded-t-2xl last:rounded-b-2xl last:border-b-0 dark:border-[#525252] dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <a
        onClick={() => {
          setOpen(false)
          setSelectedYear(label)
        }}
        className={`flex max-w-full items-center gap-2 rounded-none px-6 py-4 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800`}
      >
        {/* <img
                  src={collection.image}
                  alt={`${collection.name} Collection Image`}
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-full"
                /> */}
        <p className="reservoir-h6 truncate dark:text-white">
          {label ?? 'Show Trending'}
        </p>
      </a>
    </DropdownMenu.Item>
  )
}

export default YearDropdown
