package com.museiq.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Forward all non-api routes without a dot (no file extensions) to the React index.html
    @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}
