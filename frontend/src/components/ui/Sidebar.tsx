import React from "react";
import {
  FiPlus,
  FiDollarSign,
  FiArrowRight,
  FiTrash2,
  FiRefreshCw,
  FiLock,
  FiUsers,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  activeSection: "solana" | "ethereum";
}

const Sidebar = ({ isOpen, activeSection }: SidebarProps) => {
  const sidebarItem = (
    to: string,
    text: string,
    icon: React.ReactElement,
    disabled?: boolean
  ) => (
    <a
      href={disabled ? "#" : to}
      className={`
        flex items-center w-full p-4 gap-3 text-sm 
        ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }
        transition-colors rounded-lg
      `}
      onClick={(e) => disabled && e.preventDefault()}
    >
      {React.cloneElement(icon, { className: "text-xl flex-shrink-0" })}
      <span>{text}</span>
    </a>
  );

  return (
    <div
      className={`
        fixed left-0 top-16 h-full bg-white w-64 border-r
        transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-4">
        <div className="space-y-1 mt-4">
          {activeSection === "solana" ? (
            <>
              {sidebarItem("/spl-create", "Create Token", <FiPlus />)}
              {sidebarItem("/spl-mint", "Mint Token", <FiDollarSign />)}
              {sidebarItem("/spl-transfer", "Transfer Token", <FiArrowRight />)}
              {sidebarItem("/spl-burn", "Burn Token", <FiTrash2 />)}
              {sidebarItem("/spl-swap", "Swap Tokens", <FiRefreshCw />)}
              {sidebarItem("/spl-manage", "Manage Authorities", <FiLock />)}
              {sidebarItem("#", "Create Liquidity Pools", <FiUsers />, true)}
              {sidebarItem("#", "Add Liquidity", <FiUsers />, true)}
            </>
          ) : (
            <>
              {sidebarItem("/erc-create", "Create Token", <FiPlus />)}
              {sidebarItem("/erc-mint", "Mint Token", <FiDollarSign />)}
              {sidebarItem("/erc-transfer", "Transfer Token", <FiArrowRight />)}
              {sidebarItem("/erc-burn", "Burn Token", <FiTrash2 />)}
              {sidebarItem("#", "Create Liquidity Pools", <FiUsers />, true)}
              {sidebarItem("#", "Add Liquidity", <FiUsers />, true)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
