import React from 'react'

const ContentLayout = ({ title, children, footer }: { title: string, children: React.ReactNode, footer: React.ReactNode}) => {
  return (
    <div>
      <h1 className='mb-4 text-xl md:text-2xl'>{title}</h1>
      <div className="p-4 rounded-sm bg-gray-50 dark:bg-[#18181b]">
        <div className='px-6 rounded bg-white dark:bg-black'>
          {children}
        </div>
        <div className="mt-4">
          {footer}
        </div>
      </div>
    </div>
  )
}

export default ContentLayout