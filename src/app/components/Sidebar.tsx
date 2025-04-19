import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineInterests, MdOutlinePayments, MdAccountBalance } from 'react-icons/md';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { GoDatabase } from 'react-icons/go';
import { TbReportSearch } from 'react-icons/tb';
import { VscRepo } from 'react-icons/vsc';
import { GrUserAdmin } from 'react-icons/gr';
import { BsDatabaseAdd } from 'react-icons/bs';
import { PiUserListBold, PiUserListDuotone } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { TbShoppingBagSearch } from "react-icons/tb";
import { ImBarcode } from "react-icons/im";
import CashBook from './CashBook';
import Invoice from './Invoice';
import FindProduct from './FindProduct';
import PrevInvoice from './PrevInvoice';
import Admin from './Admin';
import Profit from './Profit';
import { FaUsersBetweenLines } from 'react-icons/fa6';

export const Sidebar = () => {
    return (
        <div className="drawer lg:drawer-open z-50">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                <div className="flex-none lg:hidden">
                    <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
                    <li><Link href="/dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                    <li><Link href="/purchase"><BsDatabaseAdd size={20} />PRODUCT ENTRY</Link></li>
                    <li>
                        <details>
                            <summary><HiOutlineShoppingBag size={20} />PRODUCT SALE</summary>
                            <ul>
                                <li><Link href="/order-place">PLACE ORDER</Link></li>
                                <li><Link href="/sale">RETAILER SALE</Link></li>
                                <li><Link href="/vendor-sale">VENDOR SALE</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href="/payment"><RiSecurePaymentLine size={20} /> TRANSACTION</Link></li>
                    <li>
                        <details>
                            <summary><GoDatabase size={20} /> STOCK REPORT</summary>
                            <ul>
                                <li><Link href="/stockreport">STOCK SUMMARY</Link></li>
                                <li><Link href="/stock-details">STOCK DETAILS</Link></li>
                                <li><Link href="/product-entry">ENTRY REPORT</Link></li>
                                <li><Link href="/stock-returned">STOCK RETURNED</Link></li>
                                <li><Link href="/pricedrop-list">PRICE-DROP LIST</Link></li>
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details>
                            <summary><TbReportSearch size={20} /> SALE REPORT</summary>
                            <ul>
                                <li><Link href="/salereport">RETAILER SALE</Link></li>
                                <li><Link href="/vendor-sale-report">VENDOR SALE</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><MdOutlinePayments size={20} /> PAYMENT REPORT</summary>
                            <ul>
                                <li><Link href="/expense-report"> EXPENSE REPORT</Link></li>
                                <li><Link href="/payment-report"> PAYMENT REPORT</Link></li>
                                <li><Link href="/retailer-pay-report"> RETAILER PAYMENT</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href="/supplier-report"><PiUserListBold size={20} /> SUPPLIER LEDGER</Link></li>
                    <li><Link href="/retailer-ledger"> <FaUsersBetweenLines size={20} /> RETAILER LEDGER</Link></li>
                    <li>
                        <details>
                            <summary><a className='flex gap-2'><VscRepo size={20} /> CASH BOOK </a></summary>
                            <ul>
                                <li>
                                    <CashBook />
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><a className='flex gap-2'><AiOutlineFileSearch size={20} />FIND INVOICE </a></summary>
                            <ul>
                                <li> <summary> <Invoice /></summary></li>
                                <li>
                                    <details>
                                        <summary>
                                            <a>PREV INVOICE</a>
                                        </summary>
                                        <ul>
                                            <li><PrevInvoice /></li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><a className='flex gap-2'><TbShoppingBagSearch size={20} />FIND PRODUCT </a></summary>
                            <ul>
                                <li>
                                    <FindProduct />
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li><details>
                        <summary><MdOutlineInterests size={20} />PROFIT REPORT</summary>
                        <ul>
                        <li> <Link href="/profit-report">RPDP / PROFIT</Link></li>
                            {/* <li>
                                <details>
                                    <summary>PROFIT / LOSS</summary>
                                    <ul>
                                        <li><Profit /></li>
                                    </ul>
                                </details>
                            </li> */}
                            <li> <Link href="/profit-withdraws">PROFIT WITHDRAW</Link></li>
                        </ul>
                    </details>
                    </li>

                    {/* <li><Link href="/barcode-generation"><ImBarcode size={20} />MAKE BARCODE</Link></li> */}
                    <li>
                        <details>
                            <summary><GrUserAdmin size={20} /> ADMINSTRATION</summary>
                            <ul>
                                <li><Admin /></li>
                            </ul>
                        </details>
                    </li>

                </ul>

            </div>
        </div>
    )
}

export default Sidebar