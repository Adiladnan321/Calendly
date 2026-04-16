"use client";

import { Toaster, ToastBar } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      containerClassName="!inset-0 !p-4 md:!p-6 !m-0 !w-full pointer-events-none"
      toastOptions={{
        style: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
          maxWidth: '100%',
          width: '100%',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={{ padding: 0, background: 'transparent', boxShadow: 'none', maxWidth: '100%', width: '100%' }}>
          {({ icon, message }) => (
            <div className="flex w-full md:w-[380px] my-2  md:ml-auto md:mr-4 md:mt-2 mx-4   items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black/5 pointer-events-auto">
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