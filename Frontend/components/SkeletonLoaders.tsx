export function MeetingsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1000px] mx-auto px-4 md:px-0 animate-pulse w-full">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-6 py-4 gap-4">
          <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
          <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
        </div>
        <div className="p-6 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-48 bg-slate-200 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AvailabilitySkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[600px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse w-full">
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 shrink-0">
        <div className="h-4 w-24 bg-slate-200 rounded mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-full bg-slate-200 rounded-lg"></div>)}
        </div>
      </div>
      <div className="flex-1 p-4 md:p-8 space-y-8">
        <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col md:flex-row md:justify-between items-start gap-4">
          <div className="space-y-3 w-full">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="h-4 w-3/4 max-w-md bg-slate-200 rounded"></div>
          </div>
          <div className="flex gap-3">
             <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
             <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-200 rounded-xl bg-white">
              <div className="flex items-center gap-3 w-32 shrink-0">
                <div className="h-5 w-5 bg-slate-200 rounded"></div>
                <div className="h-5 w-20 bg-slate-200 rounded"></div>
              </div>
              <div className="flex gap-2 flex-1 w-full">
                 <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
                 <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EventTypesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse w-full pb-20">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="relative flex items-start gap-4 rounded-xl border border-slate-100 p-5 shadow-sm bg-white">
          <div className="absolute inset-y-0 left-0 w-2 rounded-l-xl bg-slate-200"></div>
          <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-4 border-l border-transparent">
             <div className="space-y-3 w-full sm:w-1/2">
                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                <div className="h-4 w-64 bg-slate-200 rounded"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-40 bg-slate-200 rounded mt-2"></div>
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="h-10 w-28 bg-slate-200 rounded-full"></div>
                <div className="h-10 w-20 bg-slate-200 rounded-full"></div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PublicProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1040px] pt-8 md:pt-12 px-4 md:px-8 pb-12 animate-pulse w-full">
      <div className="mb-8 flex flex-col items-center text-center">
         <div className="h-[88px] w-[88px] bg-slate-200 rounded-full mb-4"></div>
         <div className="h-8 w-64 bg-slate-200 rounded mb-2"></div>
         <div className="h-4 w-96 bg-slate-200 rounded"></div>
      </div>
      <div className="grid gap-4 md:gap-[22px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-10">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className="h-[200px] border border-slate-200 border-t-4 rounded-xl bg-white p-5 space-y-4">
              <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              <div className="mt-8 h-4 w-1/3 bg-slate-200 rounded"></div>
           </div>
         ))}
      </div>
    </div>
  );
}

export function PublicBookingSkeleton() {
  return (
    <div className="relative flex w-full max-w-[1060px] flex-col overflow-hidden md:rounded-lg bg-white md:shadow-[0_1px_8px_0_rgba(0,0,0,0.08)] md:flex-row min-h-screen md:min-h-[650px] animate-pulse">
      <div className="flex w-full flex-col p-6 md:p-8 md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 bg-white md:mt-14">
         <div className="h-5 w-32 bg-slate-200 rounded mb-4"></div>
         <div className="h-8 w-64 bg-slate-200 rounded mb-6"></div>
         <div className="space-y-5">
            <div className="flex items-center gap-3">
               <div className="h-5 w-5 bg-slate-200 rounded"></div>
               <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-start gap-3">
               <div className="h-5 w-5 bg-slate-200 rounded"></div>
               <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
         </div>
      </div>
      <div className="flex w-full flex-col p-4 md:p-8 md:w-7/12 bg-white pb-12 md:pb-8">
         <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
         <div className="grid grid-cols-7 gap-[2px]">
            {[1,2,3,4,5,6,7].map(i => <div key={`head-${i}`} className="h-6 w-full bg-slate-200 rounded mb-4"></div>)}
            {Array.from({length: 35}).map((_, i) => (
              <div key={`cal-${i}`} className="aspect-square w-full bg-slate-100 rounded-full flex items-center justify-center m-1"></div>
            ))}
         </div>
      </div>
    </div>
  );
}