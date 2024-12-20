import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ToastDemo } from './ToastDemo';

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';

function App() {
	const { toast } = useToast();
	return (
		<>
			<div className="w-40 h-40 box bg-gray-200 block mx-auto my-10">
				<div className="w-full h-full text-center">Hello, World!</div>
			</div>
			<Button variant="destructive">Click me</Button>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline" className="box text-black">
						Show Dialog 123
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="text-gray-500 border-solid">
							Cancel
						</AlertDialogCancel>
						<Button
							onClick={() => {
								toast({
									title: 'Scheduled: Catch up',
									description: 'Friday, February 10, 2023 at 5:57 PM',
									className: 'bg-white text-black',
								});
							}}
						>
							Continue
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Button variant="outline" className="text-black border-solid">
				Show Toaster
			</Button>
			<ToastDemo />
			<Toaster />
		</>
	);
}

export default App;
