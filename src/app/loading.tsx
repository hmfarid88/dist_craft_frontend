export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="container">
      <div className="flex w-full h-[calc(100vh-228px)] items-center justify-center">
        <span className="loading loading-ring loading-lg text-success"></span>
      </div>
    </div>

  )

}