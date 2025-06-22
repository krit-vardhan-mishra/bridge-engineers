import CardBox from "../components/ui/CardBox";
import { PenLine, FileTextIcon, Trash, Users, ArrowRightCircle } from "lucide-react";

export const LoginPage = () => {
  return (
    <div className="flex h-screen bg-[#1C222A]">
      <div className='flex flex-col items-center justify-center h-screen bg-[#1C222A] gap-4'>
        <p className="text-white">LoginPage</p>
        <div className="p-10 flex flex-col items-end pr-2.5 w-full gap-10">
          <CardBox title={"Your space to write, express, and connect."} icon={PenLine} content={"Build, manage, and grow your personal blog with ease."} />
          <CardBox title={"Create & Share Posts"} icon={FileTextIcon} content={"Your space to write, express and connect."} />
          <CardBox title={"Edit or Delete Anytime"} icon={Trash} content={"Easily update your content or remove posts whenever you like — you're in full control."} />
          <CardBox title={"Manage Users & Role"} icon={Users} content={"Different roles for admins, writers, and readers ensure secure and flexible content management."} />
          <CardBox title={"Get Started Now"} icon={ArrowRightCircle} content={"Log in to your account to start creating and managing your blogs today."} />
        </div>
      </div>
    </div>
  )
}

export default LoginPage;