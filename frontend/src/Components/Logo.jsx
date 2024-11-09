import { SiNetflix } from 'react-icons/si'

function Logo() {
  return (
    <div className='flex items-center hover:scale-105 transition-transform duration-150'>
      <SiNetflix className='size-6 fill-blue-600' /><h1 className='text-xl font-bold'>IT</h1>
    </div>
  )
}

export default Logo
