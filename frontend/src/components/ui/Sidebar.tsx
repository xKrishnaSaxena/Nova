import { motion } from "framer-motion";
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
    <motion.div
      className={`fixed left-0 top-16 h-full w-64 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { x: 0 },
        closed: { x: "-100%" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/5 p-6">
        <div className="space-y-2">
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
    </motion.div>
  );
};

export default Sidebar;
