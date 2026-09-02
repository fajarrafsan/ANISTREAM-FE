import PosterCardSkeleton from "./PosterCardSkeleton";
import StatusCardSkeleton from "./StatusCardSkeleton";
import StatsCardSkeleton from "./StatsCardSkeleton";
import MetadataCardSkeleton from "./MetaDataCardSkeleton";

export default function SidebarSkeleton() {
    return (
        <div className="lg:col-span-4 min-w-0 space-y-3 sm:space-y-4 lg:space-y-5 lg:pt-44 xl:pt-48">
            <div className="max-w-[200px] xs:max-w-[220px] sm:max-w-none mx-auto w-full px-1 sm:px-0">
                <PosterCardSkeleton />
            </div>
            
            <StatusCardSkeleton />
            <StatsCardSkeleton />
            <MetadataCardSkeleton />
        </div>
    );
}