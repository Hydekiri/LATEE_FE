// "use client";

// import React, { useState } from "react";
// import { IssueItem } from "@/src/features/expert/types/dashboard";
// import { 
//     UserCircleIcon, 
//     CalendarDaysIcon, 
//     CheckIcon,
//     FingerPrintIcon,
//     GlobeAltIcon,
//     LockClosedIcon
// } from "@heroicons/react/24/outline";

// import { 
//     ChatBubbleLeftRightIcon,
//     PaperAirplaneIcon,
//     PencilSquareIcon,
//     TrashIcon
// } from "@heroicons/react/24/solid";

// // Dữ liệu mẫu khởi tạo chuẩn hóa theo Interface IssueItem của hệ thống
// const INITIAL_ISSUES: IssueItem[] = [
//     { 
//         id: "ISS-402", 
//         user: "Dr. Alex Blake", 
//         itemType: "Practice", 
//         contextId: "VP-902", 
//         content: "The entity dialog loops indefinitely when inquiring about post-infarction prescriptions.", 
//         status: "Open", 
//         date: "2 hours ago", 
//         isPublic: false, 
//         expertReply: null 
//     },
//     { 
//         id: "ISS-119", 
//         user: "Student Sarah Conner", 
//         itemType: "Assessment", 
//         contextId: "EX-B3", 
//         content: "Lab results provided in step 2 show inconsistent potassium levels compared to the telemetry metrics.", 
//         status: "Reviewed", 
//         date: "5 hours ago", 
//         isPublic: true, 
//         expertReply: "Reviewing telemetry datasets và bổ sung các chỉ số logic." 
//     },
// ];

// export default function FeedbackFeature() {
//     const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
//     const [actionId, setActionId] = useState<string | null>(null);
//     const [tempValue, setTempValue] = useState<string>("");

//     // Xử lý bật tắt trạng thái Public / Private của Feedback
//     const toggleVisibility = (id: string): void => {
//         setIssues(prev => prev.map(i => {
//             if (i.id === id) {
//                 const nextPublicState = !i.isPublic;
//                 return { 
//                     ...i, 
//                     isPublic: nextPublicState,
//                     status: i.expertReply ? (nextPublicState ? 'In Review' : 'Reviewed') : i.status
//                 };
//             }
//             return i;
//         }));
//     };

//     // Xóa phản hồi của chuyên gia
//     const deleteFeedback = (id: string): void => {
//         setIssues(prev => prev.map(i => i.id === id ? { ...i, expertReply: null, status: "Open", isPublic: false } : i));
//     };

//     // Lưu phản hồi mới hoặc phản hồi chỉnh sửa
//     const saveReply = (id: string): void => {
//         setIssues(prev => prev.map(i => i.id === id ? { 
//             ...i, 
//             expertReply: tempValue, 
//             status: i.isPublic ? "In Review" : "Reviewed"
//         } : i));
//         setActionId(null);
//     };

//     // Kích hoạt trạng thái gõ câu trả lời
//     const handleEditClick = (id: string, currentReply: string | null) => {
//         setActionId(id);
//         setTempValue(currentReply || "");
//     };

//     return (
//         <section className="p-6 space-y-6 h-full flex flex-col">
//             {/* Header đồng bộ tiêu đề hệ thống */}
//             <div className="shrink-0">
//                 <h1 className="text-2xl font-bold text-white">Issues & Feedback Desk</h1>
//                 <p className="text-xs text-white/70">Address system errata and resolve clinical interpretations reported by users</p>
//             </div>

//             {/* Danh sách hiển thị Full các Issues */}
//             <div className="flex-1 overflow-y-auto no-scrollbar grid gap-6 pr-1">
//                 {issues.map((issue) => (
//                     <div 
//                         key={issue.id} 
//                         className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:border-blue-200 transition-all group/card flex flex-col"
//                     >
//                         {/* Khu vực thông tin User & Trạng thái */}
//                         <div className="flex items-start justify-between mb-4">
//                             <div className="flex items-center gap-3 min-w-0">
//                                 <UserCircleIcon className="w-10 h-10 text-gray-200 shrink-0" />
//                                 <div className="min-w-0">
//                                     <div className="flex items-center gap-2">
//                                         <p className="font-bold text-[#0E2A46] text-[15px] truncate">{issue.user}</p>
//                                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border shrink-0 ${
//                                             issue.itemType === 'Practice' 
//                                                 ? 'bg-[#1BA7D9]/10 text-[#1BA7D9] border-blue-100' 
//                                                 : 'bg-[#3247BC]/10 text-[#3247BC] border-[#3247BC]/15'
//                                         }`}>
//                                             {issue.itemType}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-3 mt-0.5 text-[10px] font-medium text-gray-400">
//                                         <span className="flex items-center gap-1 font-bold text-[#235697]">
//                                             <FingerPrintIcon className="w-3 h-3" /> {issue.contextId}
//                                         </span>
//                                         <span className="flex items-center gap-1">
//                                             <CalendarDaysIcon className="w-3 h-3" /> {issue.date}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Khối quản lý trạng thái công khai và Tiến trình */}
//                             <div className="flex flex-col items-end gap-2 shrink-0">
//                                 <div className="flex items-center gap-4">
//                                     {issue.expertReply && (
//                                         <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
//                                             <div className={`flex items-center gap-1.5 transition-colors ${issue.isPublic ? 'text-emerald-600' : 'text-red-400'}`}>
//                                                 {issue.isPublic ? <GlobeAltIcon className="w-3.5 h-3.5" /> : <LockClosedIcon className="w-3.5 h-3.5" />}
//                                                 <span className="text-[9px] font-black uppercase tracking-tighter">
//                                                     {issue.isPublic ? "Public" : "Private"}
//                                                 </span>
//                                             </div>
                                            
//                                             <button 
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); 
//                                                     toggleVisibility(issue.id);
//                                                 }}
//                                                 className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none z-20 ${
//                                                     issue.isPublic ? 'bg-emerald-500' : 'bg-red-400'
//                                                 }`}
//                                             >
//                                                 <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
//                                                     issue.isPublic ? 'translate-x-5' : 'translate-x-0'
//                                                 }`} />
//                                             </button>
//                                         </div>
//                                     )}

//                                     <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white ${
//                                         issue.status === 'Reviewed' ? 'bg-[#1BA7D9]' : 
//                                         issue.status === 'In Review' ? 'bg-[#00BC10]' : 
//                                         issue.status === 'Open' ? 'bg-[#F99A00]' : 'bg-gray-400'
//                                     }`}>
//                                         {issue.status}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Nội dung báo cáo lỗi từ phía Học viên */}
//                         <div className="space-y-4 pl-1 flex-1">
//                             <p className="text-gray-700 text-[14px] bg-[#E2E8F0]/30 rounded-lg leading-relaxed italic border-l-4 border-[#235697] pl-4 py-3">
//                                 &ldquo;{issue.content}&rdquo;
//                             </p>

//                             {/* Khung nhập text phản hồi khi kích hoạt Resolve/Edit */}
//                             {actionId === issue.id ? (
//                                 <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
//                                     <textarea 
//                                         autoFocus
//                                         value={tempValue}
//                                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempValue(e.target.value)}
//                                         className="w-full bg-slate-50 border border-blue-200 rounded-lg p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1BA7D9]/20"
//                                         placeholder="Type official expert feedback..."
//                                         rows={3}
//                                     />
//                                     <div className="flex justify-end gap-2">
//                                         <button 
//                                             onClick={() => setActionId(null)} 
//                                             className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase hover:bg-gray-100 rounded-lg transition-all"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button 
//                                             onClick={() => saveReply(issue.id)} 
//                                             className="px-4 py-1.5 text-[10px] font-bold bg-[#235697] text-white uppercase rounded-lg shadow-md hover:bg-[#1BA7D9] transition-all flex items-center gap-1"
//                                         >
//                                             <CheckIcon className="w-3.5 h-3.5" /> Save Feedback
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {/* Hiển thị phản hồi cũ nếu có */}
//                                     {issue.expertReply && (
//                                         <div className="bg-[#00B7FF]/10 rounded-lg p-4 border-r-4 border-[#1BA7D9] relative group/reply shadow-sm">
//                                             <div className="flex justify-between items-center mb-1">
//                                                 <div className="flex items-center gap-2 overflow-hidden">
//                                                     <PaperAirplaneIcon className="w-3.5 h-3.5 rotate-180 text-[#235697] shrink-0" />
//                                                     <span className="text-[11px] font-black text-[#235697] uppercase tracking-tighter truncate">
//                                                         Staff Expert
//                                                     </span>
//                                                     <span className="text-[9px] font-bold text-[#1BA7D9] bg-white/60 px-1.5 py-0.5 rounded border border-[#1BA7D9]/20 whitespace-nowrap shrink-0">
//                                                         ID: EXP-007
//                                                     </span>
//                                                 </div>

//                                                 <div className="flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity shrink-0">
//                                                     <button 
//                                                         onClick={() => handleEditClick(issue.id, issue.expertReply)} 
//                                                         title="Edit Feedback" 
//                                                         className="p-1.5 bg-white text-[#1BA7D9] rounded-md shadow-sm hover:bg-[#1BA7D9] hover:text-white transition-all border border-blue-100"
//                                                     >
//                                                         <PencilSquareIcon className="w-4 h-4" />
//                                                     </button>
//                                                     <button 
//                                                         onClick={() => deleteFeedback(issue.id)} 
//                                                         title="Delete Feedback" 
//                                                         className="p-1.5 bg-white text-red-400 rounded-md shadow-sm hover:bg-red-400 hover:text-white transition-all border border-red-100"
//                                                     >
//                                                         <TrashIcon className="w-4 h-4" />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <p className="text-gray-600 text-[13px] leading-relaxed mt-1">
//                                                 {issue.expertReply}
//                                             </p>
//                                         </div>
//                                     )}
                                    
//                                     {/* Nút bấm xử lý nếu chưa được trả lời */}
//                                     {!issue.expertReply && (
//                                         <div className="flex justify-end">
//                                             <button 
//                                                 onClick={() => handleEditClick(issue.id, issue.expertReply)} 
//                                                 className="flex items-center gap-2 bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white text-[10px] font-extrabold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-widest shadow-blue-100"
//                                             >
//                                                 <PaperAirplaneIcon className="w-4 h-4" /> Resolve Now
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }