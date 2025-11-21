

const Header = ({ title }: { title: string }) => {
	return (
		<div
			className="w-screen bg-blue-800 flex justify-center text-7xl
    p-10">
			{title}
		</div>
	);
};

export default Header;
