import Shimmer from '../common/Shimmer'

const ProjectShowcaseSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className={`rounded-lg overflow-hidden shadow-lg ${
            index % 2 === 0 ? 'sm:mt-8' : ''
          }`}
        >
          <div className="relative h-40 sm:h-48">
            <Shimmer className="absolute inset-0" height="h-full" />
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <Shimmer height="h-6" width="w-3/4" />
            <Shimmer height="h-4" width="w-full" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((tagIndex) => (
                <Shimmer key={tagIndex} height="h-6" width="w-20" />
              ))}
            </div>
            <div className="flex gap-4">
              <Shimmer height="h-8" width="w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectShowcaseSkeleton 