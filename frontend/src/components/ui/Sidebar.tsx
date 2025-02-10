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
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  activeSection: "solana" | "ethereum";
}

const Sidebar = ({ isOpen, activeSection }: SidebarProps) => {
  const navigate = useNavigate();
  const sidebarItem = (
    to: string,
    text: string,
    icon: React.ReactElement,
    disabled?: boolean
  ) => (
    <motion.button
      className={`
        flex items-center text-white w-full p-4 gap-3 text-sm 
        ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }
        transition-colors rounded-lg
      `}
      onClick={(e) => {
        disabled && e.preventDefault();
        navigate(`${to}`);
      }}
    >
      {React.cloneElement(icon, { className: "text-xl flex-shrink-0" })}
      <span>{text}</span>
    </motion.button>
  );

  return (
    <motion.div
      className={`fixed left-0 top-16 h-full w-76 z-40 ${
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
              {sidebarItem("/spl-create", "Create SPL Token", <FiPlus />)}
              {sidebarItem("/spl-mint", "Mint SPL Token", <FiDollarSign />)}
              {sidebarItem(
                "/spl-transfer",
                "Transfer SPL Token",
                <FiArrowRight />
              )}
              {sidebarItem("/spl-burn", "Burn SPL Token", <FiTrash2 />)}
              {sidebarItem("/spl-manage", "Manage Authorities", <FiLock />)}
              {sidebarItem("#", "Create Liquidity Pools", <FiUsers />, true)}
              {sidebarItem("#", "Add Liquidity", <FiUsers />, true)}
              {sidebarItem("/spl-swap", "Swap SPL Tokens", <FiRefreshCw />)}
            </>
          ) : (
            <>
              {sidebarItem("/erc-create", "Create ERC-20 Token", <FiPlus />)}
              {sidebarItem("/erc-mint", "Mint ERC-20 Token", <FiDollarSign />)}
              {sidebarItem(
                "/erc-transfer",
                "Transfer ERC-20 Token",
                <FiArrowRight />
              )}
              {sidebarItem("/erc-burn", "Burn ERC-20 Token", <FiTrash2 />)}
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
