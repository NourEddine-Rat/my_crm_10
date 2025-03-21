// import AppLogoIcon from './app-logo-icon';
// import { IoLogoCodepen } from "react-icons/io";
// import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";


// export default function AppLogo() {
//     return (
//         <div className="flex items-center space-x-2 p-3 rounded-lg">
//             <MdOutlineKeyboardDoubleArrowLeft className="text-red-500 text-2xl" />
//             <div className="text-left text-black">
//                 <p className="text-md font-bold leading-tight">
//                     FRANCELIFE <sup className="text-[10px] font-semibold">CRM</sup>
//                 </p>
//             </div>
//         </div>
//     );
// }
import AppLogoIcon from './app-logo-icon';
import { IoLogoCodepen } from "react-icons/io";

export default function AppLogo() {
    return (
        <div className="flex items-center space-x-2 p-3 rounded-lg shadow-md dark:bg-black">
            <IoLogoCodepen className="text-black text-3xl dark:text-white" />
            <div className="text-left text-black dark:text-white">
                <p className="text-lg font-bold leading-tight">
                    FranceLife <sup className=" font-semibold opacity-80">CRM</sup>
                </p>
            </div>
        </div>
    );
}
