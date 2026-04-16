"use client";

import { Toaster, ToastBar } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex w-full md:w-[360px] items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="flex-shrink-0 pt-0.5">
                {icon}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-[15px] font-bold text-slate-800">
                  {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notification'}
                </p>
                <div className="mt-1 text-[14px] text-slate-500">
                  {message}
                </div>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}