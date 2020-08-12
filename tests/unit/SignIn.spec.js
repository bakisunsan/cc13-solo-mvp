import { mount } from "@vue/test-utils";
import SignIn from "../../src/components/SignIn";

describe("SignIn", () => {
    test("is a Vue instance", () => {
        // Setup
        const wrapper = mount(SignIn);

        // Execute, Assertion
        expect(wrapper.isVueInstance()).toBeTruthy();

        // Teardown
        wrapper.destroy();
    });
});