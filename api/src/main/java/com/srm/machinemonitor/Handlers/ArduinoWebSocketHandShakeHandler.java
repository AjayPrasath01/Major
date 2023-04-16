package com.srm.machinemonitor.Handlers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Tables.Machines;
import com.srm.machinemonitor.Services.MachinesDAO;
import com.srm.machinemonitor.Services.OrganizationDAO;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.math.BigInteger;
import java.net.http.HttpResponse;
import org.springframework.web.socket.server.HandshakeFailureException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Configuration
public class ArduinoWebSocketHandShakeHandler extends DefaultHandshakeHandler {

    @Autowired
    MachinesDAO machinesDAO;

    @Autowired
    OrganizationDAO organizationDAO;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String token = request.getHeaders().getFirst("machinetoken");
        String machineName = request.getHeaders().getFirst("machinename");
        String organization = request.getHeaders().getFirst("organization");
        BigInteger organizationId = organizationDAO.getIdByName(organization);
        if (organizationId == null){
            throw new HandshakeFailureException("Invlaid organization name");
        }
        if (!machinesDAO.existsByOrganizationIdAndMachineNameAndSecert(organizationId, machineName, token)){
            throw new HandshakeFailureException("Invlaid machine name or key");
        }
        List<Machines> allMachines = machinesDAO.findByMachineNamesAndOrganizationId(machineName, organizationId);
        for (Machines machine : allMachines){
            attributes.put(machine.getSensors(), machine.getId());
        }
        attributes.put(Constants.ORGANIZATION_ID, organizationId);
        attributes.put(Constants.MACHINENAME, machineName);
        attributes.put(Constants.MACHINETOKEN, token);
        return super.determineUser(request, wsHandler, attributes);
    }
}
