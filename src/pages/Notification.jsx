import { CiHeart } from 'react-icons/ci'
import { FaRegComment } from 'react-icons/fa'
import { SlUserFollow } from 'react-icons/sl'

function Notification() {
  return (
    <div className='w-full flex  justify-center pt-3'>
      <div className='bg-gray-50 flex flex-col gap-1 w-1/2 min-h-screen rounded-4xl '>

        <div className='w-full justify-center gap-4 h-25 px-20 shadow-2xl bg-white rounded-4xl flex flex-col'>
          <div className='flex  w-full gap-2 text-lg'>
            <CiHeart size={35} color='red'/> <span> user Liked to ur post: "bla bla" </span>
          </div>
          <div>
            21h ago
          </div>
        </div>
        
        <div className='w-full justify-center gap-4 h-25 px-20 shadow-2xl bg-white rounded-4xl flex flex-col'>
          <div className='flex  w-full gap-2 text-lg'>
            <FaRegComment size={30} color='green'/> <span> user commented  to ur post: "bla bla" </span>
          </div>
          <div>
            21h ago
          </div>
        </div>

        <div className='w-full justify-center gap-4 h-25 px-20 shadow-2xl bg-white rounded-4xl flex flex-col'>
          <div className='flex  w-full gap-2 text-lg'>
            <SlUserFollow size={30} color='blue'/> <span> user started following u </span>
          </div>
          <div>
            21h ago
          </div>
        </div>

      </div>
    </div>
  )
}

export default Notification