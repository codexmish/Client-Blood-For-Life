import Banner from "@/components/modules/homePage/Banner";
import CanYouDonate from "@/components/modules/homePage/CanYouDonate";
import FindDonor from "@/components/modules/homePage/FindDonor";
import RecentDonations from "@/components/modules/homePage/RecentDonations";
import Works from "@/components/modules/homePage/Works";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <FindDonor/>
      <Works/>
      <RecentDonations/>
      <CanYouDonate/>
    </div>
  );
};

export default HomePage;
