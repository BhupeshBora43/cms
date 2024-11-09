import Navbar from '../Components/Navbar'

function Layout({children}) {
  return (
    <div className=' max-w-[100vw] overflow-hidden h-[100vh] '>
      <Navbar/>
      {children}
    </div>
  )
}

export default Layout
