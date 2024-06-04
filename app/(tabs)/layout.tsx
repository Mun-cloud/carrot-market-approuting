import TabBar from "@/components/tab-bar";

const TabLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
};

export default TabLayout;
