import CardBox from "../components/ui/CardBox";
import { PenLine, FileTextIcon, Trash, Users, ArrowRightCircle } from "lucide-react";

export const LoginPage = () => {
  return (
    <div className='flex h-screen bg-[#1C222A]'>

      <div className="flex flex-col items-start justify-center p-10 w-1/2 overflow-y-auto"> 
        <div className="flex flex-col items-start gap-6 w-full">
          <CardBox title={"Your space to write, express, and connect."} icon={PenLine} content={"Build, manage, and grow your personal blog with ease."} />
          <CardBox title={"Create & Share Posts"} icon={FileTextIcon} content={"Your space to write, express and connect."} />
          <CardBox title={"Edit or Delete Anytime"} icon={Trash} content={"Easily update your content or remove posts whenever you like you're in full control."} />
          <CardBox title={"Manage Users & Role"} icon={Users} content={"Different roles for admins, writers, and readers ensure secure and flexible content management."} />
          <CardBox title={"Get Started Now"} icon={ArrowRightCircle} content={"Log in to your account to start creating and managing your blogs today."} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-1/2 bg-[#2A2E36]"> {/* Example: a darker background for visual separation */}
              <p className="text-white text-3xl font-bold mb-8">Welcome to Your Blog Space</p> {/* Increased size and added margin for visibility */}

        <h1 className="text-white text-4xl font-bold">Login Here</h1>
        <p className="text-gray-400 mt-4">Form goes here...</p>
      </div>

    </div>
  )
}

export default LoginPage;