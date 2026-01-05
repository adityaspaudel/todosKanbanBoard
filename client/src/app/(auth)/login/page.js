"use client";

"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Formik, Field, Form } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UserLogin = () => {
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100 p-4 text-gray-800">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Login
				</h1>

				<Formik
					initialValues={formData}
					onSubmit={async (values) => {
						// await sleep(500);
						// alert(JSON.stringify(values, null, 2));

						try {
							const response = await fetch(
								`${NEXT_PUBLIC_API_URL}/user/userLogin`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(values),
								}
							);

							if (!response.ok) throw new Error(response.message);

							const parsedData = await response.json();
							setFormData(parsedData);
							alert(JSON.stringify(parsedData, 2, 2));
							router.push(`/${parsedData.user.id}`);
						} catch (error) {
							console.error("error occurred", error);
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-800 mb-1"
								>
									Email
								</label>
								<Field
									name="email"
									type="email"
									placeholder="janedoe@acme.com"
									className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-800 mb-1"
								>
									Password
								</label>
								<Field
									type="password"
									name="password"
									placeholder="********"
									className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
							>
								Login
							</button>
						</Form>
					)}
				</Formik>

				<div className="text-sm flex  justify-center items-center">
					Don`t have an account?
					<Link href={`/register`}>
						<span className="hover:underline hover:text-blue-600">
							{" "}
							Signup here
						</span>
					</Link>
				</div>
				{/* <div>{JSON.stringify(formData)}</div> */}
			</div>
		</div>
	);
};

export default UserLogin;
