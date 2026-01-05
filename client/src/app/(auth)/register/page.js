"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Formik, Field, Form } from "formik";

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UserRegistration = () => {
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
	return (
		<div>
			<h1>Sign Up</h1>
			<Formik
				initialValues={formData}
				onSubmit={async (values) => {
					// await sleep(500);
					// alert(JSON.stringify(values, null, 2));

					try {
						const response = await fetch(
							`${NEXT_PUBLIC_API_URL}/user/userRegistration`,
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
						alert(parsedData.message);
					} catch (error) {
						console.error("error occurred", error);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<label htmlFor="fullName">FullName</label>
						<Field name="fullName" placeholder="Jane Doe" />

						<label htmlFor="email">Email</label>
						<Field name="email" placeholder="janedoe@acme.com" type="email" />

						<label htmlFor="password">Password</label>
						<Field type="password" name="password" placeholder="********" />
						<button type="submit" disabled={isSubmitting}>
							Submit
						</button>
					</Form>
				)}
			</Formik>

			{/* <div>{JSON.stringify(formData)}</div> */}
		</div>
	);
};

export default UserRegistration;
