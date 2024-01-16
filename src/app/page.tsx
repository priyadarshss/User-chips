'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { data } from '../data'

interface ListData {
  id: number
  name: string
  email: string
  avatar: string
}

export default function ChipComponent() {
  const [inputValue, setInputValue] = useState<string>('')
  const [chipData, setChipData] = useState<ListData[]>([])
  const [listData, setListData] = useState<ListData[]>(data)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)
  const [backspaceCount, setBackspaceCount] = useState(0)
  const [highlightedChipIndex, setHighlightedChipIndex] = useState<number>(-1)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, dropdownRef])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'Backspace' &&
        inputValue === '' &&
        chipData.length > 0
      ) {
        const lastIndex = chipData.length - 1
        setHighlightedChipIndex(lastIndex)
        setBackspaceCount((prevCount) => prevCount + 1)
        setShowDropdown(false)
      }
    }

    if (chipData.length === 0) setHighlightedChipIndex(-1)

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [inputValue, chipData])

  useEffect(() => {
    if (backspaceCount === 2) {
      const lastIndex = chipData.length - 1
      setListData([...listData, chipData[lastIndex]])
      setChipData(chipData.filter((_, index) => index !== lastIndex))
      setBackspaceCount(0)
    }
  }, [backspaceCount])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleItemClick = (item: ListData) => {
    setChipData([...chipData, item])
    setListData((prevListData) =>
      prevListData.filter((data) => data.name !== item.name)
    )
    setInputValue('')
  }

  const handleDeleteChip = (chip: ListData) => {
    setChipData(chipData.filter((data) => data.name !== chip.name))
    setListData([...listData, chip])

    if (highlightedChipIndex === chipData.length - 1) {
      setHighlightedChipIndex(-1)
    }
  }

  return (
    <div className='min-h-screen flex flex-col pt-60 items-center p-4 w-full'>
      <div className='relative mb-4 w-2/3 flex'>
        {/* chip div */}
        <div
          className={
            'flex border-2 border-b-blue-800 border-t-0 border-l-0 border-r-0 ' +
            `${chipData.length > 3 ? 'min-w-[70%] flex-wrap' : ''}`
          }
        >
          {chipData.map((chip, index) => (
            <span
              ref={inputRef}
              key={chip.name}
              className={`bg-[#cbcbcb] text-black m-1 my-2 w-max rounded-full inline-flex items-center ${
                index === highlightedChipIndex ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setHighlightedChipIndex(index)}
            >
              <Image
                src={chip.avatar}
                alt={chip.name}
                className='w-8 h-8 rounded-full mr-2'
                width={1000}
                height={1000}
              />
              <span>{chip.name}</span>
              <button
                onClick={() => handleDeleteChip(chip)}
                className='text-black font-semibold cursor-pointer'
              >
                <span className='text-xl align-center px-2'>&times;</span>
              </button>
            </span>
          ))}
        </div>
        {/* input */}
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setShowDropdown(true)}
          placeholder='Add new user...'
          className='border-2 border-t-0 border-l-0 border-r-0 p-2 w-full bg-inherit border-b-blue-800 focus:outline-none '
          ref={inputRef}
        />
      </div>
      {/* dropdown mapping */}
      {(showDropdown || inputValue.length > 0) && (
        <div
          ref={dropdownRef}
          className='max-h-[300px] overflow-auto bg-white shadow-gray-400 shadow-lg rounded-lg'
        >
          {listData
            .filter((item) =>
              item.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((filteredItem) => (
              <div
                key={filteredItem.id}
                onClick={() => handleItemClick(filteredItem)}
                className='border-b p-3 cursor-pointer hover:bg-gray-200 flex items-center'
              >
                <Image
                  src={filteredItem.avatar}
                  alt={filteredItem.name}
                  className='w-12 h-12 rounded-full mr-2'
                  width={1000}
                  height={1000}
                />
                <div className='flex w-full justify-between items-center gap-4'>
                  <div className='font-semibold'>{filteredItem.name}</div>
                  <div className='text-sm text-gray-500'>
                    {filteredItem.email}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
